import expenses from "@/app/data/expenses";
import users from "@/app/data/users";
import { NextResponse } from "next/server";

export async function GET(request: any, { params }: any) {
  const requiredUser = users.find((user) => user.user_id === params.id);
  if (!requiredUser) return NextResponse.json({ error: "User not found" });

  const requiredData = expenses.filter((user) => user.user_id === params.id);
  return NextResponse.json(requiredData);
}
