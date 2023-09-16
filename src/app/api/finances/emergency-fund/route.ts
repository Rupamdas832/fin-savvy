import { NextResponse } from "next/server";
import { calculateEmergencyFund } from "@/utils/businessLogics";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const EmergencyFundSchema = z.object({
  monthly_income: z.number(),
  job_stability: z.number(),
  total_fixed_expenses: z.number(),
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
    if (!requiredData) return NextResponse.json({ error: "User not found" });

    let emergency_fund = {
      emergency_fund: requiredData?.emergency_fund,
      monthly_income: requiredData?.monthly_income,
      job_stability: requiredData?.job_stability,
      savings: requiredData?.bank_balance + requiredData?.fd_balance,
      total_fixed_expenses: requiredData?.total_fixed_expenses,
    };

    return NextResponse.json(emergency_fund);
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
    const validatedReq = EmergencyFundSchema.parse(requestBody);
    if (userId) {
      const requiredData = await prisma.finance.findFirst({
        where: {
          user_id: {
            equals: userId,
          },
        },
      });
      if (!requiredData) return NextResponse.json({ error: "User not found" });

      const requiredFund = calculateEmergencyFund({
        total_fixed_expenses: validatedReq?.total_fixed_expenses,
        monthly_income: validatedReq?.monthly_income,
        job_stability: validatedReq?.job_stability,
      });

      const updatedData = {
        ...requiredData,
        emergency_fund: requiredFund,
        monthly_income: validatedReq?.monthly_income,
        job_stability: validatedReq?.job_stability,
      };

      const response = await prisma.finance.update({
        where: { user_id: userId },
        data: updatedData,
      });

      return NextResponse.json({ emergency_fund: requiredFund });
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
