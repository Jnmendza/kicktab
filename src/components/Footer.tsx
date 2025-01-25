import React from "react";
import Image from "next/image";
import { Instagram, Github, Facebook } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className='flex flex-col md:flex-row justify-between items-center px-6 md:px-36 py-10 bg-black text-white'>
      <div className='flex flex-col items-center mb-4 md:mb-0'>
        <Image
          src='/assets/logo.png'
          alt='Login Image'
          width={230}
          height={220}
        />
        <p className='mt-2'>© 2025 All Rights Reserved</p>
      </div>
      <div className='text-center md:text-right'>
        <h1 className='text-2xl font-bold mb-2'>KickTab</h1>
        <h2 className='text-lg mb-2'>Every Match, Every Moment, One Tab.</h2>
        <div className='flex justify-center md:justify-end space-x-4 mt-4 text-lime'>
          <Facebook className='w-6 h-6' />
          <Github className='w-6 h-6' />
          <Instagram className='w-6 h-6' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
