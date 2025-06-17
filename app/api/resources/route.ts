import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { createResourceSchema } from "@/lib/schemas/resource.schema";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);


    console.log("Session:", JSON.stringify(session, null, 2)); // Debug logging

    if (!session || !session.user || !session.user.id) {
      console.log("No session or user ID found"); // Debug logging
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = createResourceSchema.parse(body);

    const { title, description, tags, bodySystems, mediaUrls, externalLink, creationInstructions } = validatedData;
    const userId = session.user.id;

    console.log("Attempting to create resource with userId:", userId); // Debug logging
    
    // Check if user exists before creating resource
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      console.log("User not found in database:", userId); // Debug logging
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    console.log("User found, creating resource..."); // Debug logging

    const newResource = await prisma.resource.create({
      data: {
        title,
        description,
        userId,
        bodySystems: bodySystems ?? undefined,
        mediaUrls: mediaUrls ?? undefined,
        externalLink: externalLink ?? undefined,
        creationInstructions: creationInstructions ?? undefined,
        tags: {
          create: tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    console.log("Resource created successfully:", newResource.id); // Debug logging
    return NextResponse.json(newResource, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Validation failed", errors: error.errors }, { status: 400 });
    }
    console.error("Error creating resource:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
        tags: {
          include: {
            tag: { select: { id: true, name: true } },
          },
        },
      },
    });
    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
} 