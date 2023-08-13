import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType, SavingType } from "@/types/finance.type";
import { z } from "zod";
import { generalErrorHandling } from "@/app/utils/error";

const SavingsSchema = z.object({
  bank_balance: z.number(),
  fd_balance: z.number(),
  equity_balance: z.number(),
  gold_balance: z.number(),
  total_savings: z.number(),
});

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
  try {
    const validatedReq = SavingsSchema.parse(requestBody);
    const requiredIndex = finances.findIndex(
      (user) => user.user_id === params.id
    );
    const requiredData = finances[requiredIndex];
    if (!requiredData) {
      return NextResponse.json({ error: "User not found" });
    }
    const updatedData: FinanceType = {
      ...requiredData,
      savings: validatedReq,
    };
    finances[requiredIndex] = updatedData;

    return NextResponse.json(updatedData.savings);
  } catch (err) {
    console.log(err);
    return generalErrorHandling(err);
  }
}
