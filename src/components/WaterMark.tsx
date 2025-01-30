import React from "react";
import Image from "next/image";

const WaterMark = ({
  text,
  spinner = false,
  width = 80,
  height = 80,
}: {
  text: string;
  spinner?: boolean;
  width?: number;
  height?: number;
}) => {
  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <Image
        src={`/assets/watermark.png`}
        alt='ball_logo'
        width={width}
        height={height}
        className={`${spinner ? "animate-spin" : ""}`}
      />
      <p className='text-white text-2xl opacity-40 mt-8'>{text}</p>
    </div>
  );
};

export default WaterMark;
