import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // In a real application, you would verify the token with Keycloak here
  // For this example, we're just checking if it exists

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
