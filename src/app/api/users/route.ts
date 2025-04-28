import { NextRequest, NextResponse } from "next/server";
import { fetchCurrentUser, createUser } from "@/lib/api/users";
import dbConnect from "@/lib/db/connection";

// Mock auth - in a real app, this would come from auth logic
const CURRENT_USER_ID = "user123";

// GET /api/users/me - Get the current user
export async function GET() {
  try {
    await dbConnect();

    const user = await fetchCurrentUser(CURRENT_USER_ID);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userData = await request.json();
    const newUser = await createUser(userData);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
