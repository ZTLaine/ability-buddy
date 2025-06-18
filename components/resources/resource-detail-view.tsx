'use client';

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AppButton } from "@/components/ui/app-button";
import { TagTooltip } from "@/components/tag-tooltip";

import { Sprout, Flower, Edit, Trash2, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { Resource } from "@/types/resources";

interface ResourceDetailViewProps {
  resource: Resource;
  onBack: () => void;
  onResourceDeleted?: () => void;
}

export function ResourceDetailView({ resource, onBack, onResourceDeleted }: ResourceDetailViewProps) {
  const { data: session } = useSession();
  const [isSupported, setIsSupported] = useState(resource.isSupported);
  const [likesCount, setLikesCount] = useState(resource.likesCount || 0);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const isOwner = session?.user?.id === resource.userId;

  const handleSupportToggle = async () => {
    if (!session?.user) {
      toast.error("Please log in to support resources");
      return;
    }

    if (isLikeLoading) return;

    // Optimistic update
    const newIsSupported = !isSupported;
    const newLikesCount = newIsSupported ? likesCount + 1 : likesCount - 1;
    
    setIsSupported(newIsSupported);
    setLikesCount(newLikesCount);
    setIsLikeLoading(true);

    try {
      const response = await fetch(`/api/resources/${resource.id}/like`, {
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
      setIsSupported(data.liked);
      setLikesCount(data.likeCount);
      
      toast.success(data.message);
    } catch (error) {
      // Revert optimistic update on error
      setIsSupported(isSupported);
      setLikesCount(likesCount);
      toast.error("Failed to update support status");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit modal or navigate to edit page
    toast.info("Edit functionality coming soon!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resource?")) {
      return;
    }

    setIsDeleteLoading(true);

    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      toast.success("Resource deleted successfully");
      onResourceDeleted?.();
      onBack();
    } catch (error) {
      toast.error("Failed to delete resource");
      setIsDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Back Button and Action Buttons */}
      <div className="flex justify-between items-center mb-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#00796B] hover:text-[#4CAF50] hover:bg-[#4CAF50]/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Resources
        </Button>
        
        {/* Action Buttons */}
        {isOwner && (
          <div className="flex gap-2">
            <AppButton
              appVariant="secondary"
              size="sm"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Edit</span>
            </AppButton>
            <AppButton
              appVariant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleteLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{isDeleteLoading ? 'Deleting...' : 'Delete'}</span>
            </AppButton>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <Card className="paper-texture">
        <CardHeader className="bg-[#03A9F4]/5 border-b">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl md:text-3xl text-[#00796B] resources-highlight">
                {resource.title}
              </CardTitle>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <TagTooltip
                  items={resource.bodySystems || []}
                  className="bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                  tooltipLabel="Body Systems"
                  textColor="text-white"
                />
                <TagTooltip
                  items={resource.tags.map(rt => rt.tag.name)}
                  className="bg-[#B39DDB] hover:bg-[#B39DDB]/90"
                  tooltipLabel="Tags"
                  textColor="text-black"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-[#00796B] mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {resource.description}
            </p>
          </div>

          {/* Media Display */}
          {resource.mediaUrls && resource.mediaUrls.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#00796B] mb-3">Media</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resource.mediaUrls.map((url: string, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden border">
                    {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={url}
                        alt={`Media ${index + 1}`}
                        className="w-full h-auto object-cover"
                      />
                    ) : url.match(/\.(mp4|webm|ogg)$/i) ? (
                      <video
                        controls
                        className="w-full h-auto"
                        preload="metadata"
                      >
                        <source src={url} />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="p-4 bg-gray-50 text-center">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4 inline mr-2" />
                          View Media {index + 1}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creation Instructions */}
          {resource.creationInstructions && (
            <div>
              <h3 className="text-lg font-semibold text-[#00796B] mb-3">Instructions</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {resource.creationInstructions}
                </p>
              </div>
            </div>
          )}

          {/* External Link */}
          {resource.externalLink && (
            <div>
              <h3 className="text-lg font-semibold text-[#00796B] mb-3">External Link</h3>
              <a
                href={resource.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Resource
              </a>
            </div>
          )}


        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="paper-texture">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleSupportToggle}
                disabled={isLikeLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-500 ease-out hover:scale-110 active:scale-95 disabled:opacity-50"
              >
                {isSupported ? (
                  <Flower className="h-6 w-6 text-[#B39DDB] transition-all duration-500" />
                ) : (
                  <Sprout className="h-6 w-6 text-[#4CAF50] transition-all duration-500" />
                )}
                <span className="font-medium">
                  {isSupported ? 'Supported' : 'Support this resource'}
                </span>
              </button>
              
              <div className="text-gray-600">
                <span className="font-medium">{likesCount}</span>{' '}
                {likesCount === 1 ? 'supporter' : 'supporters'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 