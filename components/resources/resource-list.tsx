import React from "react";
import { ResourceCard } from "@/components/resource-card";
import type { Resource } from "@/types/resources";

interface ResourceListProps {
  resources: Resource[];
}

export function ResourceList({ resources }: ResourceListProps) {
  if (!resources || resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">No resources found.</p>
        <p className="text-gray-400">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 m-1">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          title={resource.title}
          bodySystems={resource.bodySystems || []}
          tags={resource.tags.map(rt => rt.tag.name)}
          description={resource.description}
          likesCount={resource.likesCount || 0}
          isSupported={resource.isSupported || false}
        />
      ))}
    </div>
  );
} 