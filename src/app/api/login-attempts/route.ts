import { NextResponse } from "next/server";
import { getAttemptsInfo } from "@/lib/loginAttempts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Email es obligatorio" },
      { status: 400 }
    );
  }

  return NextResponse.json(getAttemptsInfo(email.trim().toLowerCase()));
}
