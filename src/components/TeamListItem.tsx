import React, { useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";

type ListTeam = {
  teamId: number;
  teamName: string;
};

const ListTeamItem = ({ teamId, teamName }: ListTeam) => {
  const [isFollowed, setIsFollowed] = useState(false);

  const handleFollowClick = () => {
    setIsFollowed((prev) => !prev); // Toggle follow state
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
              ? "bg-green-500 text-black hover:bg-green-600"
              : "hover:bg-black"
          }`}
        >
          {isFollowed ? "Following" : "Follow"}
        </Button>
      </div>
      <Separator className='w-[95%] m-auto' />
    </div>
  );
};

export default ListTeamItem;
