"use client";
import React, { useState } from "react";
import TeamListItem from "./TeamListItem";
import { FavoriteTeam } from "./FavoritesList";
import useSWR from "swr";
import { ScrollArea } from "./ui/scroll-area";
import { fetcher, isTeamInFavorites } from "@/lib/utils";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Favorite } from "@prisma/client";

type FavoritesData = {
  teamId: number;
};

const TeamList = ({
  leagueId,
  favorites,
}: {
  leagueId: number;
  favorites: Favorite[];
}) => {
  const [favoritesData, setFavortieData] = useState<FavoritesData[]>([]);
  const { toast } = useToast();

  const {
    data: teams,
    error,
    isLoading,
  } = useSWR(`/api/teams?leagueId=${leagueId}`, fetcher);

  const handleAddFavorite = (teamId: number) => {
    setFavortieData((prevFavorites) => {
      // Check if the team is already in the favorites
      const isAlreadyFavorite = prevFavorites.some(
        (fav) => fav.teamId === teamId
      );

      if (isAlreadyFavorite) {
        // Remove it if it already exists
        return prevFavorites.filter((fav) => fav.teamId !== teamId);
      }

      // Add it if it doesn't exist
      return [...prevFavorites, { teamId }];
    });
  };

  const saveFavoritesToDB = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ favorites: favoritesData }),
      });

      if (!response.ok) {
        throw new Error("Failed to save favorites.");
      }

      toast({
        title: "Favorites saved successfully!",
      });
      setFavortieData([]);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving favorites. Please try again.",
      });
    }
  };

  console.log("Favorites Data", favoritesData);

  if (isLoading)
    return (
      <div className='flex flex-col justify-center items-center'>
        <Image
          src='/assets/whiteBall.png'
          alt='ball-logo'
          width={80}
          height={80}
          className='animate-spin'
        />
        <p className='text-white text-2xl mt-4'>Loading teams...</p>
      </div>
    );
  if (error) return <p>Error loading teams: {error.message}</p>;

  // Show the World Cup message for leagueId === 1
  if (leagueId === 1) {
    return (
      <div className='flex flex-col justify-center items-center h-full'>
        <Trophy size={150} color='white' />
        <h2 className='text-white text-3xl font-bold mt-6'>
          World Cup 2026 coming soon...
        </h2>
      </div>
    );
  }
  return (
    <div className='w-full mt-4'>
      <ScrollArea className='h-[31rem] w-full'>
        {teams.map(({ id, name }: FavoriteTeam) => (
          <TeamListItem
            key={id}
            teamId={id}
            teamName={name}
            onToggleFavorites={handleAddFavorite}
            isFavorite={isTeamInFavorites(favorites, id)}
          />
        ))}
      </ScrollArea>
      <div className='mt-4 mr-6 flex justify-end'>
        <Button
          onClick={saveFavoritesToDB}
          className='px-4 py-2 bg-lime text-white rounded-md hover:bg-green-600'
          disabled={favoritesData.length === 0}
        >
          Save Favorites
        </Button>
      </div>
    </div>
  );
};

export default TeamList;
