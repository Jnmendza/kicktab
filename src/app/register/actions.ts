"use server";

import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { z } from "zod";

// import { revalidatePath } from "next/cache";
// import { redirect } from "next/navigation";

import { createClientForServer } from "@/utils/supabase/server";
import { db } from "@/lib/db";

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

  // User successfully created
  return {
    success: true,
    message: "Check your email for the confirmation link",
  };
};
