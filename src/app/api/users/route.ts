import { NextResponse } from "next/server";
import { prisma } from "../../db/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";

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
    const newFinance = await prisma.finance.create({
      data: {
        user_id: newUser.user_id,
      },
    });
    return NextResponse.json({ userData: newUser, userFinance: newFinance });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.format();
      return NextResponse.json({ errors }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const res = await prisma.user.delete({
        where: {
          user_id: userId,
        },
      });
      return NextResponse.json({ message: "User data successfully deleted" });
    }
    return NextResponse.json(
      { message: "Please provide user id" },
      { status: 400 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.format();
      return NextResponse.json({ errors }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
