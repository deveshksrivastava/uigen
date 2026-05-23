import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, rating, message } = body;

  if (!name || !email || !rating || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: { name, email, rating: Number(rating), message },
  });

  return NextResponse.json(feedback, { status: 201 });
}

export async function GET() {
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(feedbacks);
}
