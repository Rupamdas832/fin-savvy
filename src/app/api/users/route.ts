import { NextResponse } from "next/server";
import { prisma } from "../../db/db";
import { z } from "zod";
import { generalErrorHandling } from "@/app/utils/error";

const UserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
});

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (userId) {
    const requiredUser = await prisma.user.findFirst({
      where: {
        user_id: { equals: userId },
      },
    });
    if (!requiredUser) return NextResponse.json({ error: "User not found" });

    return NextResponse.json(requiredUser);
  }

  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function POST(req: any) {
  const requestBody = await req.json();

  try {
    const validatedReq = await UserSchema.parse(requestBody);
    const newUser = await prisma.user.create({
      data: validatedReq,
    });
    return NextResponse.json(newUser);
  } catch (error) {
    console.log(error);
    return generalErrorHandling(error, NextResponse);
  }
}
