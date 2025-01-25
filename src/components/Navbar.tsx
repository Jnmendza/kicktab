import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "./ui/separator";
import WelcomeBanner from "./WelcomeBanner";
import LogoutButton from "@/app/dashboard/LogoutButton";

export default function Navbar() {
  return (
    <nav className='bg-white w-full border-b py-4'>
      <div className='flex items-center justify-between px-4 max-w-screen-xl mx-auto'>
        {/* Logo Section */}
        <Link href='/'>
          <Image
            src='/assets/logo2.png'
            alt='Login Image'
            width={150}
            height={55}
          />
        </Link>

        {/* Centered Content */}
        <div className='flex items-center justify-center'>
          <WelcomeBanner />
          <Separator
            decorative
            orientation='vertical'
            style={{
              margin: "0 15px",
              height: "40px",
              backgroundColor: "#32CD32",
            }}
          />
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
