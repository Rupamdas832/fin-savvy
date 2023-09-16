import { NextResponse } from "next/server";
import {
  calculateDebtLoad,
  calculateEmergencyFund,
} from "@/utils/businessLogics";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { DebtType, FinanceType } from "@/types/finance.type";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const DebtSchema = z.object({
  monthly_income: z.number(),
  total_emi: z.number(),
  total_loan_amount: z.number(),
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
    if (!requiredData) return NextResponse.json({ error: "User not found" });

    let debtData: DebtType = {
      monthly_income: requiredData?.monthly_income,
      total_savings: requiredData?.total_savings,
      total_emi: requiredData?.total_emi,
      total_loan_amount: requiredData?.total_loan_amount,
      emi_load: requiredData?.emi_load,
    };

    return NextResponse.json(debtData);
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
    const validatedReq = DebtSchema.parse(requestBody);
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

    const currentLoad = calculateDebtLoad({
      total_emi: validatedReq?.total_emi,
      monthly_income: validatedReq?.monthly_income,
      total_loan_amount: validatedReq?.total_loan_amount,
      total_savings: validatedReq?.total_savings,
    });

    const requiredFund = calculateEmergencyFund({
      total_fixed_expenses: requiredData?.total_fixed_expenses,
      monthly_income: validatedReq?.monthly_income,
      job_stability: requiredData?.job_stability,
    });

    const updatedData: FinanceType = {
      ...requiredData,
      monthly_income: validatedReq?.monthly_income,
      total_loan_amount: validatedReq?.total_loan_amount,
      total_emi: validatedReq?.total_emi,
      emi_load: currentLoad,
      emergency_fund: requiredFund,
    };

    const response = await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: updatedData,
    });

    return NextResponse.json({ emi_load: currentLoad });
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
