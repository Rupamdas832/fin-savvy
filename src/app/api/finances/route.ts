import { prisma } from "@/app/db/db";
import { verify } from "@/lib/jwt";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const verifiedTokenData = await verify(token);
    if (!verifiedTokenData) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    const requiredData = await prisma.finance.findUnique({
      where: {
        user_id: String(verifiedTokenData.payload.userId),
      },
    });
    if (!requiredData)
      return NextResponse.json(
        { message: "Finance data not found" },
        { status: 404 }
      );

    return NextResponse.json(requiredData);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: any) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const verifiedTokenData = await verify(token);
    if (!verifiedTokenData) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const requiredData = await prisma.finance.delete({
      where: {
        user_id: String(verifiedTokenData.payload.userId),
      },
    });
    if (!requiredData)
      return NextResponse.json(
        { message: "Finance data not found" },
        { status: 404 }
      );

    return NextResponse.json({
      message: "Finance data successfully deleted",
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
