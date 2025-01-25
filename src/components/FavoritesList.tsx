import React from "react";
import { CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import FavoritesListItem from "./FavoritesListItem";

export type FavoriteTeam = {
  id: number;
  name: string;
  code: string;
};

const favoriteTeams: FavoriteTeam[] = [
  { id: 39, name: "Wolves", code: "WOL" },
  { id: 40, name: "Liverpool", code: "LIV" },
  { id: 41, name: "Southhampton", code: "SOU" },
  { id: 42, name: "Arsenal", code: "ARS" },
  { id: 43, name: "Cardiff", code: "CAR" },
  { id: 44, name: "Burnley", code: "BUR" },
  { id: 45, name: "Everton", code: "EVE" },
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
        {favoriteTeams.map(({ id, code }: FavoriteTeam) => (
          <FavoritesListItem key={id} id={id} code={code} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
