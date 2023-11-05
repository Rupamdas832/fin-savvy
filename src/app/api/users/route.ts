import { NextResponse } from "next/server";
import { prisma } from "../../db/db";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { compare, hash } from "@/lib/hash";
import { cookies } from "next/headers";
import { sign, verify } from "@/lib/jwt";

const UserSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  password: z.string().min(8),
});

const UpdateUserSchema = z.object({
  user_id: z.string(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string(),
  password: z.string(),
  new_Password: z.string().optional(),
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
    if (verifiedTokenData.payload?.userId) {
      const requiredUser = await prisma.user.findFirst({
        where: {
          user_id: { equals: String(verifiedTokenData.payload.userId) },
        },
      });
      if (!requiredUser) return NextResponse.json({ error: "User not found" });

      return NextResponse.json(requiredUser);
    }

    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
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
    const validatedReq = await UserSchema.parse(requestBody);

    const passwordHash = await hash(validatedReq.password);
    const newUser = await prisma.user.create({
      data: {
        ...validatedReq,
        email: validatedReq.email?.toLowerCase(),
        password: passwordHash,
      },
    });

    const newFinance = await prisma.finance.create({
      data: {
        user_id: newUser.user_id,
      },
    });

    const token = await sign({
      email: newUser.email,
      userId: newUser.user_id,
    });
    const oneDay = 60 * 60 * 1000 * 24;

    cookies().set({
      name: "token",
      value: token,
      httpOnly: true,
      expires: Date.now() + oneDay,
    });

    return NextResponse.json({ email: newUser.email, userId: newUser.user_id });
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

export async function DELETE(request: any) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  try {
    if (userId) {
      const res = await prisma.user.delete({
        where: {
          user_id: userId,
        },
      });
      return NextResponse.json({ message: "User data successfully deleted" });
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

export async function PUT(req: any) {
  const requestBody = await req.json();

  try {
    const validatedReq = await UpdateUserSchema.parse(requestBody);

    let newPasswordHash;
    if (validatedReq.new_Password) {
      newPasswordHash = await hash(validatedReq.new_Password);
    }

    const findUser = await prisma.user.findFirst({
      where: {
        user_id: validatedReq.user_id,
      },
    });
    if (!findUser) return NextResponse.json({ message: "User not found" });

    const isValidPassword = await compare(
      validatedReq.password,
      findUser.password
    );
    if (isValidPassword) {
      const updatedUser = await prisma.user.update({
        where: {
          user_id: validatedReq.user_id,
        },
        data: {
          first_name: validatedReq?.first_name || findUser.first_name,
          last_name: validatedReq?.last_name || findUser.last_name,
          email: validatedReq.email,
          password: newPasswordHash || findUser.password,
        },
      });
      return NextResponse.json({ userData: updatedUser });
    }
    return NextResponse.json(
      { message: "Invalid credentials" },
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
