import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import { FinanceType, SavingType } from "@/types/finance.type";

export async function GET(request: any, { params }: any) {
  const requiredData = finances.find((user) => user.user_id === params.id);
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
    fixed_expenses: {
      house_rent: requestBody?.house_rent,
      electricity_bill: requestBody?.electricity_bill,
      utility_bill: requestBody?.utility_bill,
      food_bill: requestBody?.food_bill,
      commute_bill: requestBody?.commute_bill,
      ott_bill: requestBody?.ott_bill,
      parent_donation: requestBody?.parent_donation,
      other_bill: requestBody?.other_bill,
      total_fixed_expenses: requestBody?.total_fixed_expenses,
    },
    monthly_income: requestBody.monthly_income,
    debt: {
      ...requiredData?.debt,
      total_emi: requestBody.total_emi,
    },
  };

  finances[requiredIndex] = updatedData;

  return NextResponse.json(updatedData);
}
