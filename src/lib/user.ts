"use server";
import { createClientForServer } from "@/utils/supabase/server";

export async function fetchUserData() {
  const supabase = await createClientForServer();

  // Get user from Supabase
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching user data:", error);
    return null;
  }

  if (!user) return null;

  return user
    ? {
        id: user.id,
        userName: user.user_metadata?.userName || "<userName from db>",
      }
    : null;
}
