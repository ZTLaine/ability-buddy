import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { createResourceSchema } from "@/lib/schemas/resource.schema";
import { ZodError } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const resourceId = params.id;

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: session?.user?.id
          ? {
              where: {
                userId: session.user.id,
              },
            }
          : false,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Transform the data to match our Resource type
    const transformedResource = {
      ...resource,
      bodySystems: resource.bodySystems as string[] || [],
      mediaUrls: resource.mediaUrls as string[] || [],
      likesCount: resource._count.likes,
      isSupported: session?.user?.id ? resource.likes.length > 0 : false,
    };

    return NextResponse.json(transformedResource);
  } catch (error) {
    console.error("Error fetching resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resourceId = params.id;
    const userId = session.user.id;
    const body = await request.json();

    // Validate the request body
    const validatedData = createResourceSchema.parse(body);
    const { title, description, tags, bodySystems, mediaUrls, externalLink, creationInstructions } = validatedData;

    // Check if resource exists and user owns it
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (resource.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete existing tags first
    await prisma.resourceTag.deleteMany({
      where: { resourceId },
    });

    // Update resource with new data and tags
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title,
        description,
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
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        likes: session?.user?.id
          ? {
              where: {
                userId: session.user.id,
              },
            }
          : false,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    // Transform the data to match our Resource type
    const transformedResource = {
      ...updatedResource,
      bodySystems: updatedResource.bodySystems as string[] || [],
      mediaUrls: updatedResource.mediaUrls as string[] || [],
      likesCount: updatedResource._count.likes,
      isSupported: session?.user?.id ? updatedResource.likes.length > 0 : false,
    };

    return NextResponse.json(transformedResource);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resourceId = params.id;
    const userId = session.user.id;

    // Check if resource exists and user owns it
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    if (resource.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete resource (cascading deletes will handle related records)
    await prisma.resource.delete({
      where: { id: resourceId },
    });

    return NextResponse.json({ message: "Resource deleted successfully" });
  } catch (error) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 