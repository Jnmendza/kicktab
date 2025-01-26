import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { CircleMinus } from "lucide-react";
// import { Badge } from "./ui/badge";
// import { capitalizeFirstLetter } from "@/lib/utils";

const FavoritesListItem = ({ id }: { id: number }) => {
  return (
    <div
      key={id}
      className='flex flex-col w-auto h-[50px] items-center justify-end m-2 hover:animate-bounceOne'
    >
      <div className='relative'>
        <CircleMinus
          size={16}
          color='red'
          strokeWidth={3}
          className='absolute top-[-5] right-[-7] cursor-pointer'
        />
        <Avatar>
          <AvatarImage
            src={`https://media.api-sports.io/football/teams/${id}.png`}
            alt='avatar'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      {/* <Badge className='mt-2'>{capitalizeFirstLetter(code)}</Badge> */}
    </div>
  );
};

export default FavoritesListItem;
