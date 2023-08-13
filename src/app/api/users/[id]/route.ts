import users from "@/app/data/users";
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: any) {
  const requiredUser = users.find((user) => user.user_id === params.id);
  if (!requiredUser) return NextResponse.json({ error: "User not found" });

  return NextResponse.json(requiredUser);
}

export async function PUT(req: any, { params }: any) {
  const requiredUserIndex = users.findIndex(
    (user) => user.user_id === params.id
  );
  const requiredUser = users[requiredUserIndex];
  const requestBody = await req.json();

  if (!requiredUser) return NextResponse.json({ error: "User not found" });

  const updatedPost = {
    ...requiredUser,
    ...requestBody,
  };
  users[requiredUserIndex] = updatedPost;

  return NextResponse.json(updatedPost);
}
