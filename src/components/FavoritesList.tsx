import React from "react";
import { CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import FavoritesListItem from "./FavoritesListItem";
import { Favorite } from "@prisma/client";

export type FavoriteTeam = {
  id: number;
  name: string;
  code: string;
};

interface FavoritesListProps {
  favorites: Favorite[];
}

const FavoritesList = ({ favorites }: FavoritesListProps) => {
  const favoritesLimit = 7;
  const favoritesCount = favorites.length;
  const count = `${favoritesCount} / ${favoritesLimit}`;
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
          <FavoritesListItem key={id} id={teamId} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
