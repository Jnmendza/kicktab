"use client";

import { useState } from "react";
import Search from "./Search";
import { Card } from "./ui/card";
import WaterMark from "./WaterMark";
import FavoritesList from "./FavoritesList";
import TeamList from "./TeamList";
import useSWR from "swr";
import { fetcher } from "@/utils/utils";

const SearchContainer = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { data: leagues } = useSWR(`/api/leagues`, fetcher);
  console.log("LEAGUES", leagues);
  const handleSelect = (id: number | null) => {
    setSelectedId(id);
    console.log("SearchContainer Selected ID:", id);
  };

  return (
    <Card className='h-[750px] w-[80%] border border-[#006400] bg-black bg-opacity-30 rounded-xl p-8 flex flex-col'>
      <Search
        leagues={leagues}
        selectedId={selectedId}
        onSelect={handleSelect}
      />
      {/* WaterMark and FavoritesList container */}
      <div className='flex-grow flex flex-col items-center justify-center'>
        {selectedId === null ? (
          <WaterMark />
        ) : (
          <TeamList leagueId={selectedId} />
        )}
      </div>
      <FavoritesList />
    </Card>
  );
};

export default SearchContainer;
