"use client";

import { useEffect } from "react";
import useUserStore from "@/store/userStore";
import SearchContainer from "@/components/SearchContainer";
import Image from "next/image";

const Dashboard = () => {
  const initializeUser = useUserStore((state) => state.initializeUser);
  const fetchFavorites = useUserStore((state) => state.fetchFavorites);
  const loading = useUserStore((state) => state.loadingState);
  const userId = useUserStore((state) => state.id);

  useEffect(() => {
    const initialize = async () => {
      await initializeUser();
      if (userId) {
        await fetchFavorites(userId);
      }
    };
    initialize();
  }, [initializeUser, fetchFavorites, userId]);

  if (loading) {
    return (
      <div className='relative min-h-screen flex items-center justify-center'>
        <p className='text-white text-2xl'>Loading...</p>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen'>
      <Image
        src='/assets/bg.jpg'
        alt='Background'
        fill
        className='absolute inset-0 h-full w-full object-cover z-0'
        priority
      />
      <div className='relative z-10 flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-50 text-white'>
        <SearchContainer />
      </div>
    </div>
  );
};

export default Dashboard;
