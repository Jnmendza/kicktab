"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/dashboard"); // Redirect logged-in users to the dashboard
      }
    };

    checkUser();
  }, [router, supabase]);

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Welcome to KickTab</h1>
      <p className='text-lg text-gray-600'>
        Please{" "}
        <a href='/login' className='text-blue-500'>
          log in
        </a>{" "}
        to get started.
      </p>
    </div>
  );
}
