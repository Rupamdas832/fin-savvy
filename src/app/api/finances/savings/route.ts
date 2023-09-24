import { NextResponse } from "next/server";
import { SavingType } from "@/types/finance.type";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const SavingsSchema = z.object({
  bank_balance: z.number(),
  fd_balance: z.number(),
  equity_balance: z.number(),
  gold_balance: z.number(),
  liquid_mf_balance: z.number(),
  total_savings: z.number(),
});

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
    const requiredData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
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
      liquid_mf_balance: requiredData.liquid_mf_balance,
      total_savings: requiredData.total_savings,
    };
    return NextResponse.json(savings);
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
  const requestBody = await req.json();

  try {
    const validatedReq = SavingsSchema.parse(requestBody);
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
    const requiredData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
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
        user_id: String(verifiedTokenData.payload.userId),
      },
      data: updatedData,
    });

    return NextResponse.json({ total_savings: res.total_savings });
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
