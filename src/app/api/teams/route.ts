import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const leagueId = searchParams.get("leagueId");

  if (!leagueId) {
    return NextResponse.json(
      { error: "leagueId is required" },
      { status: 400 }
    );
  }

  try {
    const teams = await prisma.team.findMany({
      where: { leagueId: Number(leagueId) },
    });
    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 }
    );
  }
}
