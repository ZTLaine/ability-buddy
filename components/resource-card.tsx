'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TagTooltip } from "@/components/tag-tooltip"
import { ResourceCardProps } from "@/types/resources"
import { Sprout, Flower } from "lucide-react"
import { toast } from "sonner";

export function ResourceCard({ 
  id, 
  title, 
  bodySystems, 
  tags, 
  description, 
  likesCount = 0, 
  isSupported = false,
  onResourceSelect
}: ResourceCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
  const [currentIsSupported, setCurrentIsSupported] = useState(isSupported);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const handleCardClick = () => {
    if (onResourceSelect) {
      onResourceSelect(id);
    } else {
      // Fallback to direct navigation (for standalone usage)
      router.push(`/resources/${id}`);
    }
  };

  const handleSupportClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card navigation

    if (!session?.user) {
      toast.error("Please log in to support resources");
      return;
    }

    if (isLikeLoading) return;

    // Optimistic update
    const newIsSupported = !currentIsSupported;
    const newLikesCount = newIsSupported ? currentLikesCount + 1 : currentLikesCount - 1;
    
    setCurrentIsSupported(newIsSupported);
    setCurrentLikesCount(newLikesCount);
    setIsLikeLoading(true);

    try {
      const response = await fetch(`/api/resources/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to toggle support');
      }

      const data = await response.json();
      
      // Update with server response
      setCurrentIsSupported(data.liked);
      setCurrentLikesCount(data.likeCount);
    } catch (error) {
      // Revert optimistic update on error
      setCurrentIsSupported(currentIsSupported);
      setCurrentLikesCount(currentLikesCount);
      toast.error("Failed to update support status");
    } finally {
      setIsLikeLoading(false);
    }
  };

  return (
    <div className="h-full flex">
      <Card 
        className="flex flex-col overflow-visible paper-texture transition-all duration-300 hover:shadow-xl transform-gpu hover:scale-[1.02] border-2 border-gray-200 hover:border-[#4CAF50] cursor-pointer group w-full rounded-xl"
        onClick={handleCardClick}
      >
        <CardHeader className="bg-[#03A9F4]/5 p-5 transition-colors duration-300 group-hover:bg-[#03A9F4]/10 relative rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-[#00796B] group-hover:text-[#4CAF50] pb-1 transition-colors duration-300 resources-highlight">
                {title}
              </CardTitle>
              <CardDescription className="mt-1">
                <div className="flex flex-wrap gap-2 mt-2">
                  <TagTooltip
                    items={bodySystems}
                    className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 transition-all duration-300 hover:scale-105"
                    tooltipLabel="Body Systems"
                    textColor="text-white"
                  />
                  <TagTooltip
                    items={tags}
                    className="bg-[#B39DDB] hover:bg-[#B39DDB]/90 transition-all duration-300 hover:scale-105"
                    tooltipLabel="Tags"
                    textColor="text-black"
                  />
                </div>
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 flex-grow">
          <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 rounded-b-xl">
          <button
            onClick={handleSupportClick}
            disabled={isLikeLoading}
            className="flex items-center gap-2 text-gray-600 group-hover:text-gray-800 transition-all duration-500 ease-out hover:scale-110 active:scale-95 disabled:opacity-50 rounded-lg p-2 -m-2"
          >
            {currentIsSupported ? (
              <Flower className="h-4 w-4 text-[#B39DDB] transition-all duration-500" />
            ) : (
              <Sprout className="h-4 w-4 text-[#4CAF50] transition-all duration-500" />
            )}
            <span className="text-sm font-medium">
              {currentLikesCount} {currentLikesCount === 1 ? 'supporter' : 'supporters'}
            </span>
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
