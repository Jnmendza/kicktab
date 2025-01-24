"use client";
// import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/utils/actions";
import Image from "next/image";

export const GoogleSigninButton: React.FC = () => {
  // const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const isGoogleLoading = false;
  return (
    <Button
      type='button'
      variant='outline'
      onClick={signInWithGoogle}
      // disabled={isGoogleLoading}
    >
      {isGoogleLoading ? (
        <Loader2 className='mr-2 size-4 animate-spin' />
      ) : (
        <Image
          src='https://authjs.dev/img/providers/google.svg'
          alt='Google logo'
          width={20}
          height={20}
          className='mr-2'
        />
      )}{" "}
      Sign in with Google
    </Button>
  );
};
