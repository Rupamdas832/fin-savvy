import { NextResponse } from "next/server";
import finances from "@/app/data/finances";
import users from "@/app/data/users";
import { FinanceType } from "@/types/finance.type";

export async function GET(request: any, { params }: any) {
  const requiredData = finances.find((user) => user.user_id === params.id);
  if (!requiredData) {
    const requiredUser = users.find((user) => user.user_id === params.id);
    if (!requiredUser) return NextResponse.json({ error: "User not found" });

    const newData: FinanceType = {
      user_finance_id: `${finances.length}`,
      user_id: requiredUser.user_id,
      fixed_expenses: {
        house_rent: 0,
        electricity_bill: 0,
        utility_bill: 0,
        food_bill: 0,
        commute_bill: 0,
        ott_bill: 0,
        parent_donation: 0,
        other_bill: 0,
        total_fixed_expenses: 0,
      },
      savings: {
        bank_balance: 0,
        fd_balance: 0,
        equity_balance: 0,
        gold_balance: 0,
        total_savings: 0,
      },
      insurance: {
        life_insurance_cover: 0,
        critical_illness_cover: 0,
        accidental_death_cover: 0,
        health_insurance_cover: 0,
        required__life_insurance_cover: 0,
        required_critical_illness_cover: 0,
        required_accidental_death_cover: 0,
        required_health_insurance_cover: 0,
      },
      debt: {
        total_emi: 0,
        total_loan_amount: 0,
      },
      emergency_fund: 0,
      monthly_income: 0,
      job_stability: 3,
    };
    finances.push(newData);
  }
  return NextResponse.json(requiredData);
}

export async function PUT(req: any, { params }: any) {
  const requestBody = await req.json();
  const requiredIndex = finances.findIndex(
    (user) => user.user_id === params.id
  );
  const requiredData = finances[requiredIndex];

  const updatedData = {
    ...requiredData,
    ...requestBody,
  };
  finances[requiredIndex] = updatedData;
  console.log("updatedData", updatedData);
  return NextResponse.json(updatedData);
}
