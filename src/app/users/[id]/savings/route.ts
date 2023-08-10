import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType, SavingType } from "@/types/finance.type";

export async function GET(request: any, { params }: any) {
  const requiredData = finances.find((user) => user.user_id === params.id);
  if (!requiredData) {
    return NextResponse.json({ error: "User not found" });
  }

  let savings: SavingType = {
    bank_balance: 0,
    fd_balance: 0,
    equity_balance: 0,
    gold_balance: 0,
    total_savings: 0,
  };
  if (requiredData?.savings) {
    savings = {
      ...requiredData?.savings,
    };
  }

  return NextResponse.json(savings);
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
    savings: requestBody,
  };
  finances[requiredIndex] = updatedData;

  return NextResponse.json(updatedData);
}
