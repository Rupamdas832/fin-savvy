import { NextResponse } from "next/server";
import expenses from "@/app/data/expenses";
import users from "@/app/data/users";
import { ExpensesType } from "@/types/expenses.type";

export async function GET(request: any, { params }: any) {
  const requiredData = expenses.find((user) => user.user_id === params.id);
  if (!requiredData) {
    const requiredUser = users.find((user) => user.user_id === params.id);
    if (!requiredUser) return NextResponse.json({ error: "User not found" });

    const newExpenses: ExpensesType = {
      user_expenses_id: String(expenses.length),
      user_id: requiredUser.user_id,
      house_rent: 0,
      electricity_bill: 0,
      utility_bill: 0,
      commute_bill: 0,
      ott_bill: 0,
      parent_donation: 0,
      other_bill: 0,
    };
    expenses.push(newExpenses);
  }
  return NextResponse.json(requiredData);
}

export async function PUT(req: any, { params }: any) {
  const requestBody = await req.json();
  const requiredIndex = expenses.findIndex(
    (user) => user.user_id === params.id
  );
  const requiredData = expenses[requiredIndex];

  const updatedData = {
    ...requiredData,
    ...requestBody,
  };
  expenses[requiredIndex] = updatedData;

  return NextResponse.json(updatedData);
}
