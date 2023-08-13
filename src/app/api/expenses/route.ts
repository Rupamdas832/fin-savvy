import { NextResponse } from "next/server";
import expenses from "@/app/data/expenses";
import users from "@/app/data/users";
import { ExpenseType } from "@/types/expenses.type";

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(req: any) {
  const requestBody = await req.json();

  const requiredUser = users.find(
    (user) => user.user_id === requestBody.user_id
  );

  if (!requiredUser) return NextResponse.json({ error: "User not found" });

  const updatedData: ExpenseType = {
    ...requestBody,
    expense_id: String(expenses.length + 1),
  };
  expenses.push(updatedData);

  return NextResponse.json(updatedData);
}
