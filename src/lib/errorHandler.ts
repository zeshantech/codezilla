import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./db/connection";

export function apiHandler(
  handler: (
    req: NextRequest,
    params: { id: string }
  ) => Promise<{ data: any; status: number }>
) {
  return async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
      await dbConnect();

      const { data, status } = await handler(req, params);

      return NextResponse.json(data, { status });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
