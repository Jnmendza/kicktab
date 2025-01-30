"use client";
import React from "react";
import { CardHeader } from "./ui/card";
import { Separator } from "@radix-ui/react-separator";
import FavoritesListItem from "./FavoritesListItem";
import useUserStore from "@/store/userStore";
import { FavoriteTeam } from "@/types/types";
import { useToast } from "@/hooks/use-toast";
import { FAVORITES_LIMIT } from "@/lib/constants";

const FavoritesList = () => {
  const { toast } = useToast();
  const favorites = useUserStore((state) => state.favorites);
  const removeFavoriteFromDB = useUserStore(
    (state) => state.removeFavoriteFromDB
  );

  const favoritesCount = favorites.length;
  const count = `${favoritesCount} / ${FAVORITES_LIMIT}`;

  const handleRemove = async (favoriteId: number) => {
    try {
      await removeFavoriteFromDB(favoriteId);
      toast({
        title: "Favorite removed! ✅",
      });
    } catch (error) {
      toast({
        title: "Failed to remove favorite. 😢",
        variant: "destructive",
      });
      console.error({ message: "Failure removing favoirte" }, error);
    }
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
        {favorites.map(
          ({ id, teamId, teamCode }: FavoriteTeam) =>
            id !== undefined && (
              <FavoritesListItem
                key={id}
                id={id}
                teamCode={teamCode}
                teamId={teamId}
                handleRemove={() => handleRemove(id)}
              />
            )
        )}
      </div>
    </div>
  );
};

export default FavoritesList;
