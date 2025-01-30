"use client";

import useUserStore from "@/store/userStore";

export default function WelcomeBanner() {
  const userName = useUserStore((state) => state.userName);
  console.log(userName);
  if (!userName) {
    return <div>Welcome, Guest!</div>;
  }

  return (
    <div className='text-foreground p-4 rounded-lg'>
      <h1>
        <a href='/dashboard'>Welcome, {userName || "User"}</a>!
      </h1>
    </div>
  );
}
