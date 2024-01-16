import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const quizzes = await prisma.quiz.findMany();
    return NextResponse.json(quizzes, { status: 200 });
  } catch (error) {
    console.error("Fetch quizzes error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();
    const newQuiz = await prisma.quiz.create({ data });
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Create quiz error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const { id, ...data } = await request.json();
    const updatedQuiz = await prisma.quiz.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedQuiz, { status: 200 });
  } catch (error) {
    console.error("Update quiz error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const id = new URL(request.url).searchParams.get("id");
    await prisma.quiz.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Quiz deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete quiz error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
