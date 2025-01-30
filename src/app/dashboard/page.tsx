"use client";

import { useEffect } from "react";
import useUserStore from "@/store/userStore";
import SearchContainer from "@/components/SearchContainer";
import Image from "next/image";
import WaterMark from "@/components/WaterMark";

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
        {loading ? (
          <WaterMark
            height={100}
            width={100}
            spinner={true}
            text='Welcome to your dashboard'
          />
        ) : (
          <SearchContainer />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
