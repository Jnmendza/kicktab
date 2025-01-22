import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { id, email, name, image } = body;

  if (!id || !email) {
    return NextResponse.json(
      { error: "ID and email are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.upsert({
      where: { id },
      update: {},
      create: {
        id,
        email,
        name,
        image,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating/updating user:", error);
    return NextResponse.json(
      { error: "Failed to create or update user" },
      { status: 500 }
    );
  }
}
