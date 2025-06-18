import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(
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

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }

    // Check if user already liked this resource
    const existingLike = await prisma.like.findUnique({
      where: {
        resourceId_userId: {
          resourceId,
          userId,
        },
      },
    });

    if (existingLike) {
      // Unlike: remove the like
      await prisma.like.delete({
        where: {
          resourceId_userId: {
            resourceId,
            userId,
          },
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { resourceId },
      });

      return NextResponse.json({ 
        liked: false, 
        likeCount,
        message: "Resource unsupported" 
      });
    } else {
      // Like: create new like
      await prisma.like.create({
        data: {
          resourceId,
          userId,
        },
      });

      // Get updated like count
      const likeCount = await prisma.like.count({
        where: { resourceId },
      });

      return NextResponse.json({ 
        liked: true, 
        likeCount,
        message: "Resource supported" 
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 