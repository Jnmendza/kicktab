import React from "react";
import { CardHeader, CardTitle, CardDescription } from "./ui/card";
import Image from "next/image";

interface FormHeaderProps {
  title: string;
  description: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, description }) => {
  return (
    <CardHeader>
      <div className='flex justify-center mb-4'>
        <Image
          src='/assets/logo.png'
          alt='Login Image'
          width={190}
          height={200}
        />
      </div>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
  );
};

export default FormHeader;
