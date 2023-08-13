import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType } from "@/types/finance.type";
import { calculateEmergencyFund } from "@/utils/businessLogics";
import { z } from "zod";
import users from "@/app/data/users";
import { generalErrorHandling } from "@/app/utils/error";

const EmergencyFundSchema = z.object({
  monthly_income: z.number(),
  job_stability: z.number(),
  total_fixed_expenses: z.number(),
});

export async function GET(request: any, { params }: any) {
  const requiredData = finances.find((user) => user.user_id === params.id);
  if (!requiredData) {
    return NextResponse.json({ error: "User not found" });
  }

  let emergency_fund = {
    emergency_fund: requiredData.emergency_fund ?? 0,
    monthly_income: requiredData.monthly_income ?? 0,
    job_stability: requiredData.job_stability ?? 3,
    savings:
      requiredData?.savings?.bank_balance + requiredData?.savings?.fd_balance ??
      0,
    total_fixed_expenses:
      requiredData?.fixed_expenses?.total_fixed_expenses ?? 0,
  };

  return NextResponse.json(emergency_fund);
}

export async function PUT(req: any, { params }: any) {
  const requestBody = await req.json();

  try {
    const validatedReq = EmergencyFundSchema.parse(requestBody);
    const requiredIndex = finances.findIndex(
      (user) => user.user_id === params.id
    );
    const requiredData = finances[requiredIndex];
    if (!requiredData) {
      const requiredUser = users.find((user) => user.user_id === params.id);
      if (!requiredUser) return NextResponse.json({ error: "User not found" });
    }

    const requiredFund = calculateEmergencyFund({
      total_fixed_expenses: validatedReq?.total_fixed_expenses,
      monthly_income: validatedReq?.monthly_income,
      job_stability: validatedReq?.job_stability,
    });

    const updatedData: FinanceType = {
      ...requiredData,
      emergency_fund: requiredFund,
      monthly_income: validatedReq?.monthly_income,
      job_stability: validatedReq?.job_stability,
    };
    finances[requiredIndex] = updatedData;

    return NextResponse.json({ emergency_fund: requiredFund });
  } catch (err) {
    console.log(err);
    return generalErrorHandling(err);
  }
}
