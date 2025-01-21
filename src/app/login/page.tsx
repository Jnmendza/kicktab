"use client";

import { useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        // If a user is already logged in, redirect to the dashboard
        router.push("/dashboard");
      }
    };

    checkUser();
  }, [router, supabase]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error signing in:", error.message);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Login</h1>
      <button
        onClick={signInWithGoogle}
        className='px-4 py-2 bg-blue-500 text-white rounded shadow'
      >
        Sign in with Google
      </button>
    </div>
  );
}
