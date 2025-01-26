import React, { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

interface ListTeam {
  teamId: number;
  teamName: string;
  isFavorite: boolean;
  onToggleFavorites: (teamId: number) => void;
}

const TeamListItem = ({
  teamId,
  teamName,
  isFavorite,
  onToggleFavorites,
}: ListTeam) => {
  const [isFollowed, setIsFollowed] = useState(false);
  console.log("IS this my fav team", isFavorite);
  const handleFollowClick = () => {
    setIsFollowed((prev) => !prev); // Toggle the follow state
    onToggleFavorites(teamId); // Notify the parent to update favorites
  };

  return (
    <div className='flex flex-col mb-4'>
      <div className='flex justify-between'>
        <div className='flex items-center mb-4'>
          <Avatar className='ml-4'>
            <AvatarImage
              src={`https://media.api-sports.io/football/teams/${teamId}.png`}
              alt='avatar'
              width={30}
              height={30}
              className='rounded-lg'
            />
          </Avatar>
          <p className='text-white ml-6'>{teamName}</p>
        </div>
        <Button
          variant='outline'
          onClick={handleFollowClick}
          className={`mr-6 bg-transparent text-white hover:bg-opacity-20 ${
            isFollowed
              ? "bg-green-500 text-white hover:bg-green-600"
              : "hover:bg-white"
          }`}
        >
          {isFollowed ? "Selected" : "Follow"}
        </Button>
      </div>
      <Separator className='w-[95%] m-auto' />
    </div>
  );
};

export default TeamListItem;
