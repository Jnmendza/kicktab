"use client";

import { useState, useEffect } from "react";
import Search from "./Search";
import { Card } from "./ui/card";
import WaterMark from "./WaterMark";
import FavoritesList from "./FavoritesList";
import TeamList from "./TeamList";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

const SearchContainer = ({ userId }: { userId: string }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState([]);
  const { data: leagues } = useSWR(`/api/leagues`, fetcher);
  const handleSelect = (id: number | null) => {
    setSelectedId(id);
    console.log("SearchContainer Selected ID:", id);
  };

  console.log("MY FAVS::", favorites);
  useEffect(() => {
    async function fetchFavorites() {
      const response = await fetch(`/api/favorites?userId=${userId}`);
      const data = await response.json();
      setFavorites(data);
    }
    fetchFavorites();
  }, [userId]);

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
          <TeamList favorites={favorites} leagueId={selectedId} />
        )}
      </div>
      <FavoritesList favorites={favorites} />
    </Card>
  );
};

export default SearchContainer;
