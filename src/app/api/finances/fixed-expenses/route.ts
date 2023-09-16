import { NextResponse } from "next/server";
import { calculateEmergencyFund } from "@/utils/businessLogics";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const FixedExpenseSchema = z.object({
  monthly_income: z.number(),
  house_rent: z.number(),
  electricity_bill: z.number(),
  utility_bill: z.number(),
  food_bill: z.number(),
  commute_bill: z.number(),
  total_emi: z.number(),
  ott_bill: z.number(),
  parent_donation: z.number(),
  other_bill: z.number(),
  total_fixed_expenses: z.number(),
});

export async function GET(request: any) {
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
    const requiredData = await prisma.finance.findFirst({
      where: {
        user_id: {
          equals: String(verifiedTokenData.payload.userId),
        },
      },
    });
    if (!requiredData)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    let newData = {
      monthly_income: requiredData.monthly_income,
      house_rent: requiredData.house_rent,
      electricity_bill: requiredData.electricity_bill,
      utility_bill: requiredData.utility_bill,
      food_bill: requiredData.food_bill,
      commute_bill: requiredData.commute_bill,
      total_emi: requiredData.total_emi,
      ott_bill: requiredData.ott_bill,
      parent_donation: requiredData.parent_donation,
      other_bill: requiredData.other_bill,
      total_fixed_expenses: requiredData.total_fixed_expenses,
    };
    return NextResponse.json(newData);
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
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const requestBody = await req.json();

  try {
    const validatedReq = FixedExpenseSchema.parse(requestBody);
    if (userId) {
      const requiredData = await prisma.finance.findFirst({
        where: {
          user_id: {
            equals: userId,
          },
        },
      });
      if (!requiredData)
        return NextResponse.json({ error: "User not found" }, { status: 404 });

      const requiredFund = calculateEmergencyFund({
        total_fixed_expenses: validatedReq?.total_fixed_expenses,
        monthly_income: validatedReq?.monthly_income,
        job_stability: requiredData?.job_stability,
      });

      const updatedData = {
        ...requiredData,
        house_rent: validatedReq?.house_rent,
        electricity_bill: validatedReq?.electricity_bill,
        utility_bill: validatedReq?.utility_bill,
        food_bill: validatedReq?.food_bill,
        commute_bill: validatedReq?.commute_bill,
        ott_bill: validatedReq?.ott_bill,
        parent_donation: validatedReq?.parent_donation,
        other_bill: validatedReq?.other_bill,
        total_fixed_expenses: validatedReq?.total_fixed_expenses,
        monthly_income: validatedReq?.monthly_income,
        total_emi: validatedReq?.total_emi,
        emergency_fund: requiredFund,
      };

      const res = await prisma.finance.update({
        where: {
          user_id: userId,
        },
        data: updatedData,
      });
      return NextResponse.json({
        total_fixed_expenses: res.total_fixed_expenses,
      });
    }
    return NextResponse.json(
      { message: "Please provide user id" },
      { status: 400 }
    );
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
