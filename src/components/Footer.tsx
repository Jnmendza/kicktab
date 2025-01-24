import React from "react";
import Image from "next/image";
import { Instagram, Github, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <div className='flex justify-between items-center px-36 py-10 bg-black text-white'>
      <div className='flex flex-col items-center'>
        <Image
          src='/assets/logo.png'
          alt='Login Image'
          width={190}
          height={200}
        />
        <p className='mt-2'>© 2025 All Rights Reserved</p>
      </div>
      <div className=' text-right'>
        <h1 className='text-2xl font-bold mb-2'>KickTab</h1>
        <h2 className='text-lg mb-2'>Every Match, Every Moment, One Tab.</h2>
        <div className='flex justify-end space-x-4 mt-4 text-lime'>
          <Facebook className='w-6 h-6' />
          <Github className='w-6 h-6' />
          <Instagram className='w-6 h-6' />
        </div>
      </div>
    </div>
  );
};

export default Footer;
