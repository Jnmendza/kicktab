"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClientForBrowser } from "@/utils/supabase/client";

export default function WelcomeBanner() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClientForBrowser();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to fetch user:", error);
      } else {
        setUser(user);
      }
    };

    fetchUser();
  }, [supabase]);

  if (!user) {
    return <div>Welcome, Guest!</div>;
  }

  return (
    <div className='text-foreground p-4 rounded-lg'>
      <h1>
        <a href='/dashboard'>
          Welcome, {user.user_metadata.full_name || "User"}
        </a>
        !
      </h1>
    </div>
  );
}
