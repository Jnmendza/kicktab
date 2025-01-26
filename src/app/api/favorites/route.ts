import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createClientForServer } from "@/utils/supabase/server";
import { getUsersFavorties } from "@/app/data/favorites";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const favorites = await getUsersFavorties(userId);
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
  const supabase = await createClientForServer();
  const body = await req.json();
  const { favorites } = body;

  // Authenticate the user with Supabase
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error("Authentication Error:", authError);
    return NextResponse.json(
      { message: "Unauthorized or failed to get user." },
      { status: 401 }
    );
  }

  const userId = authUser.user?.id;
  console.log("USERID::::::", userId);
  if (!userId || !favorites || !Array.isArray(favorites)) {
    return NextResponse.json(
      { error: "userId and teamId are required" },
      { status: 400 }
    );
  }

  try {
    // Get current favorites count for the user
    const currentFavorites = await db.favorite.findMany({
      where: { userId },
    });

    if (currentFavorites.length + favorites.length > 7) {
      return NextResponse.json(
        { error: "You can only have up to 7 favorites." },
        { status: 400 }
      );
    }

    // Format the favorites data
    const formattedData = favorites.map((fav: { teamId: number }) => ({
      userId,
      teamId: fav.teamId,
    }));

    //Use createMany for multiple entries
    const result = await db.favorite.createMany({
      data: formattedData,
      skipDuplicates: true, // Avoid duplicate entries
    });

    return NextResponse.json({
      message: "Favorites added successfully",
      result,
    });
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
