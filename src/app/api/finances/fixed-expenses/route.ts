import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType, SavingType } from "@/types/finance.type";
import { calculateEmergencyFund } from "@/utils/businessLogics";
import { z } from "zod";
import { generalErrorHandling } from "@/app/utils/error";

const FixedExpenseSchema = z.object({
  monthly_income: z.number(),
  house_rent: z.number(),
  electricity_bill: z.number(),
  utility_bill: z.number(),
  food_bill: z.number(),
  commute_bill: z.number(),
  total_emi: z.number(),
  ott_bill: z.number(),
  parent_donation: z.number(),
  other_bill: z.number(),
  total_fixed_expenses: z.number(),
});

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "Please provide user id" });

  const requiredData = finances.find((user) => user.user_id === userId);
  if (!requiredData) {
    return NextResponse.json({ error: "User not found" });
  }

  let fixed_expenses = {
    ...requiredData.fixed_expenses,
    monthly_income: requiredData?.monthly_income,
    total_emi: requiredData?.debt?.total_emi,
  };

  return NextResponse.json(fixed_expenses);
}

export async function PUT(req: any) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const requestBody = await req.json();

  try {
    const validatedReq = FixedExpenseSchema.parse(requestBody);
    const requiredIndex = finances.findIndex((user) => user.user_id === userId);
    const requiredData = finances[requiredIndex];
    if (!requiredData) {
      return NextResponse.json({ error: "User not found" });
    }

    const requiredFund = calculateEmergencyFund({
      total_fixed_expenses: validatedReq?.total_fixed_expenses,
      monthly_income: validatedReq?.monthly_income,
      job_stability: requiredData?.job_stability,
    });

    const updatedData: FinanceType = {
      ...requiredData,
      fixed_expenses: {
        house_rent: validatedReq?.house_rent,
        electricity_bill: validatedReq?.electricity_bill,
        utility_bill: validatedReq?.utility_bill,
        food_bill: validatedReq?.food_bill,
        commute_bill: validatedReq?.commute_bill,
        ott_bill: validatedReq?.ott_bill,
        parent_donation: validatedReq?.parent_donation,
        other_bill: validatedReq?.other_bill,
        total_fixed_expenses: validatedReq?.total_fixed_expenses,
      },
      monthly_income: validatedReq?.monthly_income,
      debt: {
        ...requiredData?.debt,
        total_emi: validatedReq?.total_emi,
      },
      emergency_fund: requiredFund,
    };

    finances[requiredIndex] = updatedData;
    return NextResponse.json(updatedData.fixed_expenses);
  } catch (err) {
    console.log(err);
    return generalErrorHandling(err, NextResponse);
  }
}
