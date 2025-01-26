import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const leagues = await db.league.findMany();
    return NextResponse.json(leagues);
  } catch (error) {
    console.error("Error fetching leagues;", error);
    return NextResponse.json(
      { error: "Failed to fetch leagues" },
      { status: 500 }
    );
  }
}
