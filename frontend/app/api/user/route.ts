import prisma from "../../../lib/prisma";
import { users } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

// string unions are defined this way because this allows us to check if a
// string is in the union without having to declare the members of the union
// twice.
const ordering = ["registationDate", "id", "firstName", "lastName"] as const;
export type Ordering = typeof ordering[number];

const searchType = ["id", "name"] as const;
export type SearchType = typeof searchType[number];

export async function PUT(req: NextRequest) {
  const changes = await req.json() as users;

  // check if id is set
  if (typeof changes.id !== "number") {
    return NextResponse.json({ error: "id parameter missing" }, { status: 400 });
  }

  const user = await prisma.users.update({
    where: { id: changes.id },
    data: changes,
  });

  return NextResponse.json(user);
}

export async function POST(req: NextRequest) {
  const user = await prisma.users.create({
    data: { ...await req.json() },
  });
  return NextResponse.json(user);
}

export async function DELETE(req: NextRequest) {
  const user = await prisma.users.delete({
    where: {
      id: Number(req.nextUrl.searchParams.get("id"))
    }
  });
  return NextResponse.json(user)
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const orderby = req.nextUrl.searchParams.get("orderby") ?? "registationDate";
  const searchFor = req.nextUrl.searchParams.get("searchFor");
  const searchType = req.nextUrl.searchParams.get("searchType");

  if (!ordering.includes(orderby as Ordering)) {
    return NextResponse.json({ message: "Invalid ordering" }, {status: 400})
  }

  if (typeof searchFor == "string") {
    if (searchType === "id") {
      const id = parseInt(searchFor);

      if (Number.isNaN(id)) {
        return NextResponse.json({ message: `${searchFor} is not a valid id` }, {status: 400})
      }

      const users = await prisma.users.findMany({
        where: { id }
      })
      return NextResponse.json(users)
    }

    if (searchType === "name") {
      const users = await prisma.users.findMany({
        where: {
          OR: [
            {
              firstName: {
                contains: searchFor,
                mode: "insensitive",
              }
            },
            {
              lastName: {
                contains: searchFor,
                mode: "insensitive",
              }
            }
          ]
        },
        orderBy: [
          { [orderby as string]: "desc" }
        ]
      })
      return NextResponse.json(users)
    }
  }

  // return all users if the request doesn't have the id query parameter
  if (id === null) {
    try {
      const users = await prisma.users.findMany({
        orderBy: [{ [orderby as string]: "desc" }]
      });
      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json({ message: `Server error: ${error}` }, { status: 500});
    }
  }

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }
  try {
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }
    const fullName = `${user.firstName} ${user.lastName}`;
    return NextResponse.json({ ...user, fullName });
  } catch (error) {
    console.error("Fetch user error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
