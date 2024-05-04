import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { getFirstAndLastDateOfAMonth } from "@/utils/general";

const InvestmentSchema = z.object({
  description: z.string(),
  investment_category_id: z.string(),
  amount: z.number(),
  investment_date: z.string(),
  investment_id: z.string(),
});

const CreateInvestmentSchema = InvestmentSchema.partial({
  investment_id: true,
});

const DeleteInvestmentSchema = z.object({
  investment_id: z.string(),
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

      const requiredData = await prisma.investments.findMany({
        where: {
          user_id: { equals: String(verifiedTokenData.payload.userId) },
          investment_date: {
            gte: startDate,
            lte: endDate,
          },
        },
      });

      if (!requiredData)
        return NextResponse.json(
          { error: "Investments not found" },
          { status: 404 }
        );

      return NextResponse.json(requiredData);
    } else {
      const investments = await prisma.investments.findMany();
      return NextResponse.json(investments);
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

    const validatedReq = CreateInvestmentSchema.parse(requestBody);

    const payload = {
      ...validatedReq,
      investment_date: new Date(validatedReq.investment_date),
      user_id: String(verifiedTokenData.payload.userId),
    };

    const newInvestment = await prisma.investments.create({
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

    return NextResponse.json(newInvestment);
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

    const validatedReq = InvestmentSchema.parse(requestBody);

    const prevInvestment = await prisma.investments.findFirst({
      where: {
        investment_id: validatedReq.investment_id,
      },
    });
    if (!prevInvestment)
      return NextResponse.json({ error: "Investment not found" });

    const payload = {
      ...validatedReq,
      user_id: String(verifiedTokenData.payload.userId),
    };

    const updateInvestment = await prisma.investments.update({
      where: { investment_id: validatedReq.investment_id },
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
        prevInvestment.amount -
        updateInvestment.amount,
      total_savings:
        requiredFinanceData.total_savings +
        prevInvestment.amount -
        updateInvestment.amount,
    };
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: financePayload,
    });

    return NextResponse.json(updateInvestment);
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

    const validatedReq = DeleteInvestmentSchema.parse(requestBody);

    const deleteInvestment = await prisma.investments.delete({
      where: { investment_id: validatedReq.investment_id },
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
      bank_balance: requiredFinanceData.bank_balance + deleteInvestment.amount,
      total_savings:
        requiredFinanceData.total_savings + deleteInvestment.amount,
    };
    await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: financePayload,
    });

    return NextResponse.json(deleteInvestment);
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
