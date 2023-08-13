"use client";

import { z } from "zod";

export const generalErrorHandling = (err: any, NextResponse: any) => {
  if (err instanceof z.ZodError) {
    const errors = err.format();
    return NextResponse.json({ errors }, { status: 400 });
  }
  return NextResponse.json(
    { message: "Something went wrong" },
    { status: 500 }
  );
};
