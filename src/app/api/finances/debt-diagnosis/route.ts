import { NextResponse } from "next/server";
import {
  calculateDebtLoad,
  calculateEmergencyFund,
} from "@/utils/businessLogics";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { DebtType, FinanceType } from "@/types/finance.type";

const DebtSchema = z.object({
  monthly_income: z.number(),
  total_emi: z.number(),
  total_loan_amount: z.number(),
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
      if (!requiredData) return NextResponse.json({ error: "User not found" });

      let debtData: DebtType = {
        monthly_income: requiredData?.monthly_income,
        total_savings: requiredData?.total_savings,
        total_emi: requiredData?.total_emi,
        total_loan_amount: requiredData?.total_loan_amount,
        emi_load: requiredData?.emi_load,
      };

      return NextResponse.json(debtData);
    } else {
      return NextResponse.json(
        { message: "Please provide user id" },
        { status: 400 }
      );
    }
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
    const validatedReq = DebtSchema.parse(requestBody);
    if (userId) {
      const requiredData = await prisma.finance.findFirst({
        where: {
          user_id: {
            equals: userId,
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
        where: { user_id: userId },
        data: updatedData,
      });

      return NextResponse.json({ emi_load: currentLoad });
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
