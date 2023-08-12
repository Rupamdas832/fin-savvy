import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType, SavingType } from "@/types/finance.type";

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

  const requiredIndex = finances.findIndex(
    (user) => user.user_id === params.id
  );
  const requiredData = finances[requiredIndex];
  if (!requiredData) {
    return NextResponse.json({ error: "User not found" });
  }
  const updatedData: FinanceType = {
    ...requiredData,
    emergency_fund: requestBody.emergency_fund,
    monthly_income: requestBody.monthly_income,
    job_stability: requestBody.job_stability,
  };
  finances[requiredIndex] = updatedData;

  return NextResponse.json(updatedData);
}
