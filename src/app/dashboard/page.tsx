"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@prisma/client"; // Import your Prisma User type

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (!supabaseUser) {
        router.push("/login");
      } else {
        // Transform the Supabase user into the Prisma User type
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          name: supabaseUser.user_metadata?.name || null,
          image: supabaseUser.user_metadata?.avatar_url || null,
          createdAt: supabaseUser.created_at
            ? new Date(supabaseUser.created_at)
            : new Date(), // Fallback to current date
          updatedAt: supabaseUser.updated_at
            ? new Date(supabaseUser.updated_at)
            : new Date(), // Fallback to current date
        });
      }
    };

    fetchUser();
  }, [router, supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (!user) {
    return null; // Render a loader or return nothing while checking the user
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-2xl font-bold mb-4'>Welcome, {user.email}</h1>
      <button
        onClick={signOut}
        className='px-4 py-2 bg-red-500 text-white rounded shadow'
      >
        Sign Out
      </button>
    </div>
  );
}
