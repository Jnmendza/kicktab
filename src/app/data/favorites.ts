import { db } from "@/lib/db";

export const getUsersFavorties = async (userId: string) => {
  try {
    const favorites = await db.favorite.findMany({
      where: { userId },
      include: { team: true },
    });

    return favorites;
  } catch (error) {
    console.error("Error fetching favorites in utility:", error);
    throw new Error("Failed to fetch favorites");
  }
};
