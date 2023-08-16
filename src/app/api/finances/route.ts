import finances from "@/app/data/finances";
import { prisma } from "@/app/db/db";
import { NextResponse } from "next/server";

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const requiredData = finances.find((user) => user.user_id === userId);
  if (!requiredData && userId) {
    const requiredUser = await prisma.user.findFirst({
      where: {
        user_id: { equals: userId },
      },
    });
    if (!requiredUser) return NextResponse.json({ error: "User not found" });
  }

  return NextResponse.json(requiredData);
}
