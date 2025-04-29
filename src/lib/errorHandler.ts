import { NextRequest, NextResponse } from "next/server";
import dbConnect from "./db/connection";
import { ApiException, ValidationException } from "./exceptions";

export function apiHandler(handler: (req: NextRequest, params: any) => Promise<{ data: any; status: number }>) {
  return async (req: NextRequest, { params }: { params: any }) => {
    try {
      await dbConnect();

      const { data, status } = await handler(req, params);

      return NextResponse.json(data, { status });
    } catch (error) {
      console.error("******************************************************", JSON.stringify(error), "******************************************************");
      return NextResponse.json(
        {
          error: error instanceof ApiException ? error.message : "Internal Server Error",
          statusCode: error instanceof ApiException ? error.statusCode : 500,
          errors: error instanceof ValidationException ? error.errors : [],
        },
        { status: error instanceof ApiException ? error.statusCode : 500 }
      );
    }
  };
}
