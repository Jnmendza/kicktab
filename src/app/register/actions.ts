"use server";

import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

import { createClientForServer } from "@/utils/supabase/server";
import { db } from "@/lib/db";
import { createAdminClient } from "@/utils/supabase/admin";

export const registerUser = async ({
  email,
  userName,
  password,
  passwordConfirm,
}: {
  email: string;
  userName: string;
  password: string;
  passwordConfirm: string;
}) => {
  const newUserSchema = z
    .object({
      email: z.string().email(),
    })
    .and(passwordMatchSchema);

  const newUserValidation = newUserSchema.safeParse({
    email,
    userName,
    password,
    passwordConfirm,
  });

  if (!newUserValidation.success) {
    return {
      error: true,
      message: newUserValidation.error.issues[0]?.message ?? "An error occured",
    };
  }

  // supabase authentication from here
  const supabase = await createClientForServer();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return {
      error: true,
      message: error.message,
    };
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      error: true,
      message: "Email already in use",
    };
  }

  const supabaseUserId = data.user?.id;

  if (!supabaseUserId) {
    return {
      error: true,
      message: "Failed to retrieve user ID from Supabase",
    };
  }

  // Insert the new user into Prisma DB
  try {
    await db.user.create({
      data: {
        id: supabaseUserId,
        email,
        userName,
      },
    });
  } catch (dbError) {
    console.error(dbError);
    return {
      error: true,
      message: "Failed to create user in the database",
    };
  } finally {
    await db.$disconnect();
  }

  // User successfully created now update the users metadata by using Admin API. Do not use updateUser because it requires a session
  try {
    const adminClient = createAdminClient();
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      supabaseUserId,
      {
        user_metadata: {
          userName,
        },
      }
    );

    if (updateError) {
      console.error("Error updating user metadata:", updateError);
      return { error: true, message: "Failed to update user metadata." };
    }
  } catch (updateError) {
    console.error("Error updating user metadata", updateError);
  }
  return {
    success: true,
    message: "Check your email for the confirmation link",
  };
};
