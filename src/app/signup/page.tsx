"use client";

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SignUpPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const signUpWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return;
    }

    // After redirection, fetch the authenticated user's details
    const { data, error: fetchError } = await supabase.auth.getUser();

    if (fetchError) {
      console.error("Error fetching user:", fetchError.message);
      return;
    }

    const supabaseUser = data.user;

    if (supabaseUser) {
      // Sync the user with Prisma
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: supabaseUser.id,
          email: supabaseUser.email,
          name: supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
        }),
      });

      // Redirect to the dashboard after sign-up
      router.push("/dashboard");
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Sign Up</h1>
      <button
        onClick={signUpWithGoogle}
        className='px-4 py-2 bg-green-500 text-white rounded shadow'
      >
        Sign up with Google
      </button>
    </div>
  );
}
