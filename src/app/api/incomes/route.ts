import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { getFirstAndLastDateOfAMonth } from "@/utils/general";

const IncomeSchema = z.object({
  description: z.string(),
  income_category_id: z.string(),
  amount: z.number(),
  income_date: z.string(),
  income_id: z.string(),
});

const CreateIncomeSchema = IncomeSchema.partial({
  income_id: true,
});

const DeleteIncomeSchema = z.object({
  income_id: z.string(),
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
      const { startDate, endDate } = getFirstAndLastDateOfAMonth(month, year);
      const requiredData = await prisma.incomes.findMany({
        where: {
          user_id: { equals: String(verifiedTokenData.payload.userId) },
          income_date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      if (!requiredData)
        return NextResponse.json(
          { error: "Incomes not found" },
          { status: 404 }
        );

      return NextResponse.json(requiredData);
    } else {
      const incomes = await prisma.incomes.findMany();
      return NextResponse.json(incomes);
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

    const validatedReq = CreateIncomeSchema.parse(requestBody);

    const payload = {
      ...validatedReq,
      income_date: new Date(validatedReq.income_date),
      user_id: String(verifiedTokenData.payload.userId),
    };

    const newIncome = await prisma.incomes.create({
      data: payload,
    });
    const requiredFinance = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: {
        total_savings:
          validatedReq.amount +
          (requiredFinance?.total_savings ? requiredFinance.total_savings : 0),
        bank_balance:
          validatedReq.amount +
          (requiredFinance?.bank_balance ? requiredFinance.bank_balance : 0),
      },
    });
    return NextResponse.json(newIncome);
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

    const validatedReq = IncomeSchema.parse(requestBody);

    const payload = {
      ...validatedReq,
      user_id: String(verifiedTokenData.payload.userId),
    };

    const selectedIncome = await prisma.incomes.findFirst({
      where: {
        income_id: {
          equals: validatedReq.income_id,
        },
      },
    });

    const updateIncome = await prisma.incomes.update({
      where: { income_id: validatedReq.income_id },
      data: payload,
    });
    const requiredFinance = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    if (selectedIncome) {
      await prisma.finance.update({
        where: { user_id: String(verifiedTokenData.payload.userId) },
        data: {
          total_savings:
            (requiredFinance?.total_savings
              ? requiredFinance.total_savings
              : 0) -
            selectedIncome.amount +
            updateIncome.amount,
          bank_balance:
            (requiredFinance?.bank_balance ? requiredFinance.bank_balance : 0) -
            selectedIncome.amount +
            updateIncome.amount,
        },
      });
    }

    return NextResponse.json(updateIncome);
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

    const validatedReq = DeleteIncomeSchema.parse(requestBody);

    const deleteIncome = await prisma.incomes.delete({
      where: { income_id: validatedReq.income_id },
    });
    const requiredFinance = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: {
        total_savings:
          (requiredFinance?.total_savings ? requiredFinance.total_savings : 0) -
          deleteIncome.amount,
        bank_balance:
          (requiredFinance?.bank_balance ? requiredFinance.bank_balance : 0) -
          deleteIncome.amount,
      },
    });
    return NextResponse.json(deleteIncome);
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
