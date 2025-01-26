import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const favorites = await db.favorite.findMany({
      where: { userId },
      include: { team: true },
    });
    return NextResponse.json(favorites);
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, teamId } = body;

  if (!userId || !teamId) {
    return NextResponse.json(
      { error: "userId and teamId are required" },
      { status: 400 }
    );
  }

  try {
    const favorite = await db.favorite.create({
      data: { userId, teamId },
    });
    return NextResponse.json(favorite);
  } catch (error) {
    console.error("Error adding favorite:", error);
    return NextResponse.json(
      { error: "Failed to add favorite" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const favoriteId = searchParams.get("id");

  if (!favoriteId) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  try {
    await db.favorite.delete({
      where: { id: Number(favoriteId) },
    });
    return NextResponse.json({ message: "Favorite deleted successfully" });
  } catch (error) {
    console.error("Error deleting favorite:", error);
    return NextResponse.json(
      { error: "Failed to delete favorite" },
      { status: 500 }
    );
  }
}
