"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const leagues = [
  {
    id: 1,
    value: "premier-league",
    label: "Premier League",
  },
  {
    id: 2,
    value: "la-liga",
    label: "La Liga",
  },
  {
    id: 3,
    value: "ligue-1",
    label: "Ligue 1",
  },
  {
    id: 4,
    value: "serie-a",
    label: "Seria A",
  },
  {
    id: 5,
    value: "mls",
    label: "MLS",
  },
];

const SearchContainer = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  console.log("SearchContainer Selected ID:", selectedId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-[200px] justify-between bg-black'
        >
          {selectedId
            ? leagues.find((league) => league.id === selectedId)?.label
            : "Select a league..."}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandInput placeholder='Search a league...' className='h-9' />
          <CommandEmpty>No league found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {leagues.map((league) => (
                <CommandItem
                  key={league.value}
                  value={league.value}
                  onSelect={() => {
                    setSelectedId(league.id === selectedId ? null : league.id);
                    setOpen(false);
                  }}
                >
                  {league.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedId === league.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchContainer;
