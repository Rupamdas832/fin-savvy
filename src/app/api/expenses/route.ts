import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";

const ExpenseSchema = z.object({
  user_id: z.string(),
  description: z.string(),
  expense_category_id: z.string(),
  amount: z.number(),
  expense_date: z.string(),
});

export async function GET(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const requiredData = await prisma.expenses.findMany({
        where: {
          user_id: { equals: userId },
        },
      });

      if (!requiredData)
        return NextResponse.json(
          { error: "Expenses not found" },
          { status: 404 }
        );

      return NextResponse.json(requiredData);
    } else {
      const expenses = await prisma.expenses.findMany();
      return NextResponse.json(expenses);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.format();
      return NextResponse.json({ errors }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
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

    const payload = {
      ...validatedReq,
      expense_date: new Date(validatedReq.expense_date),
    };

    const newExpense = await prisma.expenses.create({
      data: payload,
    });
    return NextResponse.json(newExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.format();
      return NextResponse.json({ errors }, { status: 400 });
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
