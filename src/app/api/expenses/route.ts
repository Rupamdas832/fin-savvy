import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const ExpenseSchema = z.object({
  description: z.string(),
  expense_category_id: z.string(),
  amount: z.number(),
  expense_date: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const verifiedTokenData = await verify(token);
    if (!verifiedTokenData) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    if (verifiedTokenData.payload?.userId) {
      const requiredData = await prisma.expenses.findMany({
        where: {
          user_id: { equals: String(verifiedTokenData.payload.userId) },
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
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const verifiedTokenData = await verify(token);
    if (!verifiedTokenData) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const validatedReq = ExpenseSchema.parse(requestBody);
    const requiredUser = await prisma.user.findFirst({
      where: {
        user_id: { equals: String(verifiedTokenData.payload.userId) },
      },
    });

    if (!requiredUser)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const payload = {
      ...validatedReq,
      expense_date: new Date(validatedReq.expense_date),
      user_id: String(verifiedTokenData.payload.userId),
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
