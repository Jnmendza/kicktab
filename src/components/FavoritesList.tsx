import React from "react";
import { CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import FavoritesListItem from "./FavoritesListItem";

export type FavoriteTeam = {
  id: number;
  name: string;
};

const favoriteTeams: FavoriteTeam[] = [
  { id: 39, name: "Wolves" },
  { id: 40, name: "Liverpool" },
  { id: 41, name: "Southhampton" },
  { id: 42, name: "Arseneal" },
  { id: 43, name: "Brighton" },
  { id: 44, name: "Brighton" },
  { id: 45, name: "Brighton" },
];

const FavoritesList = () => {
  const favoritesLimit = 7;
  const favoritesCount = favoriteTeams.length;
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
        {favoriteTeams.map(({ id }: FavoriteTeam) => (
          <FavoritesListItem key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
