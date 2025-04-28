import { NextRequest, NextResponse } from "next/server";
import {
  getUserProblemProgress,
  updateUserProblemProgress,
} from "@/lib/api/users";
import dbConnect from "@/lib/db/connection";

// Mock auth - in a real app, this would come from auth logic
const CURRENT_USER_ID = "user123";

// GET /api/users/problems/:id/progress - Get user's progress for a specific problem
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const progress = await getUserProblemProgress(CURRENT_USER_ID, id);

    if (!progress) {
      return NextResponse.json(
        { message: "No progress found for this problem" },
        { status: 404 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error(`Error fetching progress for problem ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch problem progress" },
      { status: 500 }
    );
  }
}

// PUT /api/users/problems/:id/progress - Update user's progress for a specific problem
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
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
    console.error(`Error updating progress for problem ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update problem progress" },
      { status: 500 }
    );
  }
}
