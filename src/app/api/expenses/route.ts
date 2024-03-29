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
  expense_id: z.string(),
});

const CreateExpenseSchema = ExpenseSchema.partial({
  expense_id: true,
});

const DeleteExpenseSchema = z.object({
  expense_id: z.string(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const currentMonth = new Date().toISOString().split("-");
  const month = searchParams.get("month")
    ? Number(searchParams.get("month"))
    : Number(currentMonth[1]);
  const year = searchParams.get("year")
    ? Number(searchParams.get("year"))
    : Number(currentMonth[0]);

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
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      const requiredData = await prisma.expenses.findMany({
        where: {
          user_id: { equals: String(verifiedTokenData.payload.userId) },
          expense_date: {
            gte: startDate,
            lt: endDate,
          },
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

    const validatedReq = CreateExpenseSchema.parse(requestBody);

    const payload = {
      ...validatedReq,
      expense_date: new Date(validatedReq.expense_date),
      user_id: String(verifiedTokenData.payload.userId),
    };

    const newExpense = await prisma.expenses.create({
      data: payload,
    });
    const requiredFinanceData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    if (!requiredFinanceData)
      return NextResponse.json({ error: "User not found" });
    const financePayload = {
      ...requiredFinanceData,
      bank_balance: requiredFinanceData.bank_balance - validatedReq.amount,
      total_savings: requiredFinanceData.total_savings - validatedReq.amount,
    };
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: financePayload,
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

export async function PUT(req: any) {
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

    const prevExpense = await prisma.expenses.findFirst({
      where: {
        expense_id: validatedReq.expense_id,
      },
    });
    if (!prevExpense) return NextResponse.json({ error: "Expense not found" });

    const payload = {
      ...validatedReq,
      user_id: String(verifiedTokenData.payload.userId),
    };

    const updateExpense = await prisma.expenses.update({
      where: { expense_id: validatedReq.expense_id },
      data: payload,
    });

    const requiredFinanceData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    if (!requiredFinanceData)
      return NextResponse.json({ error: "User not found" });
    const financePayload = {
      ...requiredFinanceData,
      bank_balance:
        requiredFinanceData.bank_balance +
        prevExpense.amount -
        updateExpense.amount,
      total_savings:
        requiredFinanceData.total_savings +
        prevExpense.amount -
        updateExpense.amount,
    };
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: financePayload,
    });
    return NextResponse.json(updateExpense);
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

export async function DELETE(req: any) {
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

    const validatedReq = DeleteExpenseSchema.parse(requestBody);

    const deleteExpense = await prisma.expenses.delete({
      where: { expense_id: validatedReq.expense_id },
    });

    const requiredFinanceData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    if (!requiredFinanceData)
      return NextResponse.json({ error: "User not found" });
    const financePayload = {
      ...requiredFinanceData,
      bank_balance: requiredFinanceData.bank_balance + deleteExpense.amount,
      total_savings: requiredFinanceData.total_savings + deleteExpense.amount,
    };
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: financePayload,
    });

    return NextResponse.json(deleteExpense);
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
