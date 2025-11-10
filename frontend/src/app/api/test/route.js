import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Student from "@/server/models/Student";

export async function GET() {
  await connectToDatabase();
  const student = await Student.findOne().populate("branch").lean();
  console.log(student);
  return NextResponse.json({ student });
}
