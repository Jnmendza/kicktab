import { redirect } from "next/navigation";
import { createClientForServer } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Dashboard() {
  const supabase = await createClientForServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <div className='relative min-h-screen'>
      {/* Background Image */}
      <Image
        src='/assets/bg.jpg'
        alt='Background'
        fill
        className='absolute inset-0 h-full w-full object-cover z-0'
        priority
      />

      {/* Overlay Content */}
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-50 text-white'>
        <h1 className='text-4xl font-bold'>Welcome to the Dashboard</h1>
        <p className='mt-4 text-lg'>This is your personalized dashboard.</p>
        {/* Add your UI elements here */}
      </div>
    </div>
  );
}
