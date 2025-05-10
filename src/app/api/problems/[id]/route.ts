import { NextRequest, NextResponse } from "next/server";
import { fetchProblemById } from "@/lib/api/problems";
import dbConnect from "@/lib/db/connection";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  try {
    await dbConnect();

    const problem = await fetchProblemById(id);

    if (!problem) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch (error) {
    console.error(`Error fetching problem ${id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch problem" },
      { status: 500 }
    );
  }
}
