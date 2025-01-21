import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { leagues } from "../src/app/data/leagues";

const prisma = new PrismaClient();

const endpointParams = "/teams";
const seasonYr = 2024;
const API_KEY = process.env.API_FOOTBALL_API_KEY;
console.log("KEY", API_KEY);

const fetchTeams = async (leagueId: number) => {
  try {
    const response = await axios.get(
      `${process.env.API_FOOTBALL_URL}${endpointParams}`,
      {
        params: { league: leagueId, season: seasonYr },
        headers: { "x-rapidapi-key": API_KEY },
      }
    );
    console.log(`Teams fetched for league ${leagueId}`, response.data.response);
    return response.data.response;
  } catch (error) {
    console.error(`Error fetching teams for league ${leagueId}`, error);
  }
};

const seed = async () => {
  try {
    console.log("Seeding leagues, teams, and venues...");

    for (const league of leagues) {
      console.log(`Seeding league: ${league.name}`);
      const createdLeague = await prisma.league.upsert({
        where: { id: league.id },
        update: {},
        create: {
          id: league.id,
          name: league.name,
          type: "League",
          country: league.country,
          flagUrl: league.flagUrl,
          logoUrl: `https://media.api-sports.io/football/leagues/${league.id}.png`,
          startDate: new Date(),
          endDate: new Date(),
        },
      });

      console.log(`Fetching teams for league: ${league.name}`);

      const teams = await fetchTeams(league.id);

      if (!teams || teams.length === 0) {
        console.warn(
          `No teams found for league: ${league.name} (${league.id})`
        );
      }

      for (const teamData of teams) {
        const { team, venue } = teamData;

        if (!venue) {
          console.warn(`No venue data available for team ${team.name}`);
        }

        if (!team) {
          console.error(`Incomplete team data for league ${league.name}`);
          continue;
        }

        console.log(
          `Seeding team: ${team.name}, Venue: ${venue?.name} || "No Venue"`
        );
        // Seed the venue if it doesn't exist
        let createdVenue;
        try {
          createdVenue = await prisma.venue.upsert({
            where: { id: venue.id },
            update: {},
            create: {
              id: venue.id,
              name: venue.name,
              address: venue.address,
              city: venue.city,
              capacity: venue.capacity,
              surface: venue.surface,
              imageUrl: venue.image,
            },
          });
        } catch (error) {
          console.error(`Error seeding venue for team ${team.name}:`, error);
        }

        console.log(`Seeding team: ${team.name}`);
        try {
          await prisma.team.create({
            data: {
              id: team.id,
              name: team.name,
              code: team.code,
              country: team.country,
              founded: team.founded,
              logoUrl: team.logo,
              leagueId: createdLeague.id,
              venueId: createdVenue?.id,
            },
          });
        } catch (error) {
          console.error(
            `Error creating team ${team.name} for league ${league.name}`,
            error
          );
        }
      }
    }

    console.log("Seeding complete!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
