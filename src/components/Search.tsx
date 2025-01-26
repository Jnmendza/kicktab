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
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { League } from "@/types/types";

interface SearchProps {
  leagues: League[];
  selectedId?: number | null;
  onSelect?: (id: number | null) => void;
}

const Search: React.FC<SearchProps> = ({
  leagues = [],
  selectedId = null,
  onSelect = () => {},
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between bg-transparent text-white'
        >
          {selectedId
            ? leagues.find((league) => league.id === selectedId)?.name ||
              "Unknown League"
            : "Select a league..."}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn("p-0 bg-transparent text-black w-full")}
        align='start'
        style={{
          width: "var(--radix-popover-trigger-width)",
        }}
      >
        <Command className={cn("rounded-md border text-black w-full")}>
          <CommandInput
            placeholder='Search a league...'
            className='h-9 text-black'
          />
          {leagues.length > 0 ? (
            <CommandGroup className='w-full'>
              <CommandList>
                {leagues.map(({ name, id }: League) => (
                  <CommandItem
                    key={id}
                    value={name}
                    onSelect={() => {
                      onSelect(id === selectedId ? null : id);
                      setOpen(false);
                    }}
                  >
                    <Avatar>
                      <AvatarImage
                        src={`https://media.api-sports.io/football/leagues/${id}.png`}
                        alt='avatar'
                        width={30}
                        height={30}
                        className='rounded-lg'
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {name}
                    <Check
                      className={cn(
                        "ml-auto",
                        selectedId === id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </CommandGroup>
          ) : (
            <CommandEmpty>No leagues available.</CommandEmpty>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Search;
