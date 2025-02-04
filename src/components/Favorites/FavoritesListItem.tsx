import React from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { CircleMinus } from "lucide-react";
import { Badge } from "../ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";

interface FavoriteItem {
  id: number;
  teamId: number;
  teamCode: string;
  handleRemove: (favoriteId: number) => void;
}

const FavoritesListItem = ({
  id,
  teamId,
  teamCode,
  handleRemove,
}: FavoriteItem) => {
  return (
    <div
      key={id}
      className='flex flex-col w-auto h-[60px] items-center justify-end m-2'
    >
      <div className='relative'>
        <CircleMinus
          size={16}
          color='red'
          strokeWidth={3}
          className='absolute top-[-5] right-[-7] cursor-pointer'
          onClick={() => handleRemove(id)}
        />
        <Avatar>
          <AvatarImage
            src={`https://media.api-sports.io/football/teams/${teamId}.png`}
            alt='avatar'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
      <Badge className='mt-[-3] z-10'>
        {capitalizeFirstLetter(teamCode) || "Fav"}
      </Badge>
    </div>
  );
};

export default FavoritesListItem;
