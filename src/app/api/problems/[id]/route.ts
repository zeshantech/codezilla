import { NextRequest, NextResponse } from "next/server";
import { fetchProblemById } from "@/lib/api/problems";
import dbConnect from "@/lib/db/connection";

// GET /api/problems/:id - Fetch a single problem by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const problem = await fetchProblemById(id);

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error(`Error fetching problem ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}
