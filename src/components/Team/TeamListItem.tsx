import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import useUserStore from "@/store/userStore";
import { FAVORITES_LIMIT } from "@/lib/constants";

interface ListItem {
  teamId: number;
  teamName: string;
  teamCode: string;
}

const TeamListItem: React.FC<ListItem> = ({ teamId, teamName, teamCode }) => {
  const {
    favorites,
    selectedFavorites,
    addFavoriteToDeck,
    removeFavoriteFromDeck,
  } = useUserStore();

  // Check if the team is already in favorites or selected
  const isFollowing = favorites.some((fav) => fav.teamId === teamId);
  const isSelected = selectedFavorites.some((fav) => fav.teamId === teamId);

  // Calculate the total number of favorites (saved + selected)
  const currentFavsCount = favorites.length;
  const selectedFavsCount = selectedFavorites.length;
  const totalFavorites = currentFavsCount + selectedFavsCount;
  const hasReachedFavsLimit = totalFavorites === FAVORITES_LIMIT;

  // Handle follow/unfollow button click
  const handleFollowClick = () => {
    if (isSelected) {
      removeFavoriteFromDeck(teamId);
    } else {
      addFavoriteToDeck(teamId, teamCode);
    }
  };

  // Determine button text and styles
  const buttonText = isFollowing
    ? "Following"
    : isSelected
      ? "Selected"
      : "Follow";
  const buttonStyles = {
    base: "mr-6 px-4 py-2 rounded",
    following: "bg-gray-400 text-white cursor-not-allowed",
    selected: "bg-blue-500 text-white",
    follow: "bg-green-500 text-white",
  };

  const buttonVariant = isFollowing
    ? buttonStyles.follow
    : isSelected
      ? buttonStyles.selected
      : buttonStyles.follow;

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
          disabled={(isFollowing || hasReachedFavsLimit) && !isSelected}
          className={`${buttonStyles.base} ${buttonVariant}`}
        >
          {buttonText}
        </Button>
      </div>
      <Separator className='w-[95%] m-auto' />
    </div>
  );
};

export default TeamListItem;
