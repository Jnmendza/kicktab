import { signInWithGoogle } from "@/utils/actions";
import React from "react";

const page = () => {
  return (
    <form>
      <button className='btn' type='button' onClick={signInWithGoogle}>
        Sign in with Google
      </button>
    </form>
  );
};

export default page;
