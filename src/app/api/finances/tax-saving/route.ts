import { NextResponse } from "next/server";
import { calculateTaxBenefit } from "@/utils/businessLogics";
import { z } from "zod";
import { prisma } from "@/app/db/db";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { verify } from "@/lib/jwt";
import { TaxSavingType } from "@/types/finance.type";

const TaxSavingSchema = z.object({
  monthly_epf: z.number(),
  life_insurance_premium: z.number(),
  elss_investment: z.number(),
  health_insurance_premium: z.number(),
  parents_health_insurance_premium: z.number(),
  is_user_age_above_sixty: z.boolean(),
  is_parents_age_above_sixty: z.boolean(),
  nps_investment: z.number(),
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
    if (!requiredData) return NextResponse.json({ error: "User not found" });

    const tax_saving = {
      monthly_epf: requiredData.monthly_epf,
      life_insurance_premium: requiredData.life_insurance_premium,
      elss_investment: requiredData.elss_investment,
      health_insurance_premium: requiredData.health_insurance_premium,
      parents_health_insurance_premium:
        requiredData.parents_health_insurance_premium,
      is_user_age_above_sixty: requiredData.is_user_age_above_sixty,
      is_parents_age_above_sixty: requiredData.is_parents_age_above_sixty,
      nps_investment: requiredData.nps_investment,
      required_80C_investment: requiredData.required_80C_investment,
      required_80D_investment: requiredData.required_80D_investment,
      required_80CCD_investment: requiredData.required_80CCD_investment,
    };

    return NextResponse.json({ ...tax_saving });
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
    const validatedReq = TaxSavingSchema.parse(requestBody);
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
    const requiredInvestment = calculateTaxBenefit(validatedReq);

    const payload = {
      ...validatedReq,
      ...requiredInvestment,
    };

    const response = await prisma.finance.update({
      where: { user_id: String(verifiedTokenData.payload.userId) },
      data: payload,
    });

    return NextResponse.json({ ...requiredInvestment });
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
