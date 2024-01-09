import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const casussen = await prisma.casus.findMany();
    return NextResponse.json(casussen, { status: 200 });
  } catch (error) {
    console.error("Fetch casussen error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const data = await request.json();
    const newCasus = await prisma.casus.create({ data });
    return NextResponse.json(newCasus, { status: 201 });
  } catch (error) {
    console.error("Create casus error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const { id, ...data } = await request.json();
    const updatedCasus = await prisma.casus.update({
      where: { id: Number(id) },
      data,
    });
    return NextResponse.json(updatedCasus, { status: 200 });
  } catch (error) {
    console.error("Update casus error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const id = new URL(request.url).searchParams.get("id");
    await prisma.casus.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Casus deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete casus error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
