import { NextResponse } from "next/server";
import { SavingType } from "@/types/finance.type";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";

const SavingsSchema = z.object({
  bank_balance: z.number(),
  fd_balance: z.number(),
  equity_balance: z.number(),
  gold_balance: z.number(),
  total_savings: z.number(),
});

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const requiredData = await prisma.finance.findFirst({
        where: {
          user_id: {
            equals: userId,
          },
        },
      });
      if (!requiredData)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      let savings: SavingType = {
        bank_balance: requiredData.bank_balance,
        fd_balance: requiredData.fd_balance,
        equity_balance: requiredData.equity_balance,
        gold_balance: requiredData.gold_balance,
        total_savings: requiredData.total_savings,
      };
      return NextResponse.json(savings);
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

export async function PUT(req: any) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const requestBody = await req.json();

  try {
    const validatedReq = SavingsSchema.parse(requestBody);

    if (userId) {
      const requiredData = await prisma.finance.findFirst({
        where: {
          user_id: {
            equals: userId,
          },
        },
      });
      if (!requiredData)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      const updatedData = {
        ...requiredData,
        ...validatedReq,
      };
      const res = await prisma.finance.update({
        where: {
          user_id: userId,
        },
        data: updatedData,
      });

      return NextResponse.json({ total_savings: res.total_savings });
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
