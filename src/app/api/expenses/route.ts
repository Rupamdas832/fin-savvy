import { NextResponse } from "next/server";
import expenses from "@/app/data/expenses";
import { ExpenseType } from "@/types/expenses.type";
import { z } from "zod";
import { generalErrorHandling } from "@/app/utils/error";
import { prisma } from "@/app/db/db";

const ExpenseSchema = z.object({
  user_id: z.string(),
  expense_id: z.string(),
  description: z.string(),
  expense_category_id: z.string(),
  amount: z.number(),
  created_at: z.string(),
});

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const requiredData = expenses.filter((user) => user.user_id === userId);
  if (!requiredData && userId) {
    const requiredUser = await prisma.user.findFirst({
      where: {
        user_id: { equals: userId },
      },
    });

    if (!requiredUser) return NextResponse.json({ error: "User not found" });
  }

  return NextResponse.json(requiredData);
}

export async function POST(req: any) {
  const requestBody = await req.json();

  try {
    const validatedReq = ExpenseSchema.parse(requestBody);
    const requiredUser = await prisma.user.findFirst({
      where: {
        user_id: { equals: validatedReq.user_id },
      },
    });

    if (!requiredUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updatedData: ExpenseType = {
      ...validatedReq,
      expense_id: String(expenses.length + 1),
    };
    expenses.push(updatedData);

    return NextResponse.json(updatedData);
  } catch (err) {
    console.log(err);
    return generalErrorHandling(err, NextResponse);
  }
}
