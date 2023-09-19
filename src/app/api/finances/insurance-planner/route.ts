import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { InsuranceType } from "@/types/finance.type";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";

const InsuranceSchema = z.object({
  life_insurance_cover: z.number(),
  critical_illness_cover: z.number(),
  accidental_death_cover: z.number(),
  health_insurance_cover: z.number(),
  total_loan_amount: z.number(),
  monthly_income: z.number(),
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

    let insuranceData: InsuranceType = {
      monthly_income: requiredData.monthly_income,
      life_insurance_cover: requiredData.life_insurance_cover,
      critical_illness_cover: requiredData.critical_illness_cover,
      accidental_death_cover: requiredData.accidental_death_cover,
      health_insurance_cover: requiredData.health_insurance_cover,
      required__life_insurance_cover:
        requiredData.required__life_insurance_cover,
      required_critical_illness_cover:
        requiredData.required_critical_illness_cover,
      required_accidental_death_cover:
        requiredData.required_accidental_death_cover,
      required_health_insurance_cover:
        requiredData.required_health_insurance_cover,
      total_loan_amount: requiredData.total_loan_amount,
    };
    return NextResponse.json(insuranceData);
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
    const validatedReq = InsuranceSchema.parse(requestBody);
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

    const calculatedData = {
      required__life_insurance_cover:
        (requiredData.monthly_income > 0
          ? requiredData.monthly_income * 12 * 10
          : validatedReq.monthly_income * 12 * 10) +
        requiredData.total_loan_amount,
      required_critical_illness_cover: 3000000,
      required_accidental_death_cover: requiredData.monthly_income * 12 * 5,
      required_health_insurance_cover: 500000,
    };

    const updatedData = {
      ...requiredData,
      ...validatedReq,
      ...calculatedData,
    };
    const res = await prisma.finance.update({
      where: {
        user_id: String(verifiedTokenData.payload.userId),
      },
      data: updatedData,
    });

    return NextResponse.json({ ...calculatedData });
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
