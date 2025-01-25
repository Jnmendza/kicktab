import React from "react";
import Image from "next/image";

const WaterMark = () => {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Image src='/assets/watermark.png' alt='logo2' width={80} height={80} />
      <p className='text-white opacity-40 mt-8'>
        Select a league to search for clubs
      </p>
    </div>
  );
};

export default WaterMark;
