import React from "react";
import { CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import FavoritesListItem from "./FavoritesListItem";
import useUserStore from "@/store/userStore";
import { Favorite } from "@/types/types";
// import { useQuery } from "@tanstack/react-query";
// import { getUsersFavorties } from "@/app/data/favorites";

const FavoritesList = () => {
  const favorites = useUserStore((state) => state.favorites);
  console.log("FROM LIST", favorites);
  const removeFavoriteFromDB = useUserStore(
    (state) => state.removeFavoriteFromDB
  );
  const favoritesLimit = 7;
  const favoritesCount = favorites.length;
  const count = `${favoritesCount} / ${favoritesLimit}`;

  const handleRemove = (favoriteId: number) => {
    removeFavoriteFromDB(favoriteId);
  };

  return (
    <div className='flex flex-row  items-center bg-transparent text-white'>
      <CardHeader className='flex items-center justify-center'>
        Favorites
        <br />
        {count}
      </CardHeader>
      <Separator
        decorative
        orientation='vertical'
        style={{
          margin: "0 15px",
          height: "70px",
          border: "1px solid white",
        }}
      />
      <div className='flex overflow-auto'>
        {favorites.map(({ id, teamId }: Favorite) => (
          <FavoritesListItem
            key={id}
            id={id}
            teamId={teamId}
            handleRemove={() => id !== undefined && handleRemove(id)}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
