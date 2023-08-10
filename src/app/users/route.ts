import { NextResponse } from "next/server";
import users from "../data/users";

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: any) {
  const requestBody = await req.json();

  const newUser = {
    ...requestBody,
    user_id: String(users.length),
  };
  users.push(newUser);

  return NextResponse.json(newUser);
}
