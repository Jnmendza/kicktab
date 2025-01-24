"use server";

import { redirect } from "next/navigation";

import { createClientForServer } from "@/utils/supabase/server";

export async function logout() {
  const supabase = await createClientForServer();
  await supabase.auth.signOut();
  redirect("/login");
}
