import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Mock user data - in a real app, you'd decode the token or make a request to Keycloak
    return NextResponse.json({
      id: "123",
      username: "user",
      email: "user@example.com",
      roles: ["user"],
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
