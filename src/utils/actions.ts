"use server";
import { createClientForServer } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWith = async (provider: Provider) => {
  const supabase = await createClientForServer();

  const auth_callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  console.log("SIGN IN GOOGLE", sessionData, sessionError);

  if (error) {
    throw error;
  }

  redirect(data?.url);
};

const signInWithGoogle = () => {
  return new Promise((resolve, reject) => {
    signInWith("google").then(resolve).catch(reject);
  });
};

const signOut = async () => {
  const supabase = await createClientForServer();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
};

export { signInWithGoogle, signOut };
