import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/utils/actions";
import Image from "next/image";

export const GoogleSigninButton: React.FC = () => {
  return (
    <Button type='button' variant='outline' onClick={signInWithGoogle}>
      <Image
        src='https://authjs.dev/img/providers/google.svg'
        alt='Google-logo'
        width={20}
        height={20}
        className='mr-2'
      />{" "}
      Sign in with Google
    </Button>
  );
};
