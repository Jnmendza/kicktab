// import React from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import useUserStore from "@/store/userStore";

interface ListItem {
  teamId: number;
  teamName: string;
}

const TeamListItem = ({ teamId, teamName }: ListItem) => {
  const {
    favorites,
    selectedFavorites,
    addFavoriteToDeck,
    removeFavoriteFromDeck,
  } = useUserStore();
  const isFollowing = favorites.some((fav) => fav.teamId === teamId);
  const isSelected = selectedFavorites.some((fav) => fav.teamId === teamId);

  const handleFollowClick = () => {
    if (isSelected) {
      removeFavoriteFromDeck(teamId);
    } else {
      addFavoriteToDeck(teamId);
    }
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
          disabled={isFollowing}
          className={`mr-6 px-4 py-2 rounded ${
            isFollowing
              ? "bg-gray-400 text-white cursor-not-allowed"
              : isSelected
                ? "bg-blue-500 text-white"
                : "bg-green-500 text-white"
          }`}
        >
          {isFollowing ? "Following" : isSelected ? "Selected" : "Follow"}
        </Button>
      </div>
      <Separator className='w-[95%] m-auto' />
    </div>
  );
};

export default TeamListItem;
