import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const favoriteId = params.id;
  console.log("PARAMS", favoriteId);
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
