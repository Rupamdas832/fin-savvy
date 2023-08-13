import { NextResponse } from "next/server";
import expenses from "@/app/data/expenses";
import users from "@/app/data/users";
import { ExpenseType } from "@/types/expenses.type";
import { z } from "zod";
import { generalErrorHandling } from "@/app/utils/error";

const ExpenseSchema = z.object({
  user_id: z.string(),
  expense_id: z.string(),
  description: z.string(),
  expense_category_id: z.string(),
  amount: z.number(),
  created_at: z.string(),
});

export async function GET() {
  return NextResponse.json(expenses);
}

export async function POST(req: any) {
  const requestBody = await req.json();

  try {
    const validatedReq = ExpenseSchema.parse(requestBody);
    const requiredUser = users.find(
      (user) => user.user_id === validatedReq.user_id
    );

    if (!requiredUser) return NextResponse.json({ error: "User not found" });

    const updatedData: ExpenseType = {
      ...validatedReq,
      expense_id: String(expenses.length + 1),
    };
    expenses.push(updatedData);

    return NextResponse.json(updatedData);
  } catch (err) {
    console.log(err);
    return generalErrorHandling(err);
  }
}
