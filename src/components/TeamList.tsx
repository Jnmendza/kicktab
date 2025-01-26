import React from "react";
import TeamListItem from "./TeamListItem";
import { FavoriteTeam } from "./FavoritesList";
import useSWR from "swr";
import { ScrollArea } from "./ui/scroll-area";
import { fetcher } from "@/lib/utils";
import Image from "next/image";
import { Trophy } from "lucide-react";
const TeamList = ({ leagueId }: { leagueId: number }) => {
  const {
    data: teams,
    error,
    isLoading,
  } = useSWR(`/api/teams?leagueId=${leagueId}`, fetcher);

  console.log("Teams:", teams);

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
    <ScrollArea className='h-[32rem] w-full'>
      {teams.map(({ id, name }: FavoriteTeam) => (
        <TeamListItem key={id} teamId={id} teamName={name} />
      ))}
    </ScrollArea>
  );
};

export default TeamList;
