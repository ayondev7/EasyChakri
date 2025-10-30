import { NextRequest, NextResponse } from "next/server";
import AUTH_ROUTES from "@/routes/authRoutes";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(AUTH_ROUTES.credential.signup, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to create account" },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json(
      { message: "An error occurred during signup" },
      { status: 500 }
    );
  }
}
