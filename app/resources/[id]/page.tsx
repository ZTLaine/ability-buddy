import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound, redirect } from "next/navigation";
import { ResourceDetailClient } from "@/components/resources/resource-detail-client";
import prisma from "@/lib/prisma";
import type { Resource } from "@/types/resources";

interface ResourceDetailPageProps {
  params: { id: string };
}

async function getResource(id: string, userId?: string): Promise<Resource | null> {
  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
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
        likes: userId
          ? {
              where: {
                userId,
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
      return null;
    }

    // Transform the data to match our Resource type
    return {
      ...resource,
      bodySystems: resource.bodySystems as string[] || [],
      mediaUrls: resource.mediaUrls as string[] || [],
      likesCount: resource._count.likes,
      isSupported: userId ? resource.likes.length > 0 : false,
    };
  } catch (error) {
    console.error("Error fetching resource:", error);
    return null;
  }
}

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  // Redirect to main resources page with query parameter for better UX
  // This maintains consistency and allows users to use filters/navigation
  redirect(`/resources?id=${params.id}`);
} 