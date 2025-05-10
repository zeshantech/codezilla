import { NextRequest, NextResponse } from "next/server";
import {
  getUserProblemProgress,
  updateUserProblemProgress,
} from "@/lib/api/users";
import dbConnect from "@/lib/db/connection";

const CURRENT_USER_ID = "666666666666666666666666";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await dbConnect();
    const progress = await getUserProblemProgress(CURRENT_USER_ID, id);

    if (!progress) {
      return NextResponse.json(
        { message: "No progress found for this problem" },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error(`Error fetching progress for problem ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch problem progress" },
      { status: 500 }
    );
  }
}

// PUT /api/users/problems/:id/progress - Update user's progress for a specific problem
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await dbConnect();

    const progressData = await request.json();

    const success = await updateUserProblemProgress(
      CURRENT_USER_ID,
      id,
      progressData
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to update progress" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error updating progress for problem ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to update problem progress" },
      { status: 500 }
    );
  }
}
