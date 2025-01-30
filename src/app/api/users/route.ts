import { createClientForServer } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const supabase = await createClientForServer();
  const body = await req.json();

  const { name, email, image } = body;

  // Fetch the authenticated user's ID
  const { data: authUser, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    console.error("Authentication Error:", authError);
    return NextResponse.json(
      { message: "Unauthorized or failed to get user." },
      { status: 401 }
    );
  }

  const userId = authUser.user?.id;

  if (!userId || !email) {
    console.error("Missing user ID or email.");
    return NextResponse.json(
      { message: "Invalid user ID or email." },
      { status: 400 }
    );
  }

  const { data: user, error: userError } = await supabase
    .from("User")
    .insert({
      id: userId,
      email,
      name,
      image,
    })
    .select("*")
    .single();

  if (userError) {
    console.error("Database Insertion Error:", userError);
    return NextResponse.json(
      { message: "Failed to insert user into database." },
      { status: 500 }
    );
  }

  return NextResponse.json({ user });
}
