import { prisma } from "@/app/db/db";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const requiredData = await prisma.finance.findUnique({
        where: {
          user_id: userId,
        },
      });
      if (!requiredData)
        return NextResponse.json(
          { message: "Finance data not found" },
          { status: 404 }
        );

      return NextResponse.json(requiredData);
    }
    return NextResponse.json(
      { message: "Please provide user id" },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
  }
}

export async function DELETE(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const requiredData = await prisma.finance.delete({
        where: {
          user_id: userId,
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
    }
    return NextResponse.json(
      { message: "Please provide user id" },
      { status: 400 }
    );
  } catch (error) {
    console.log(error);
  }
}
