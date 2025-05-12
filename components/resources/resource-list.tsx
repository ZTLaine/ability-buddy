import React from "react";
import { ResourceCard } from "@/components/resource-card";
import { MockResource } from "@/types/resources";

interface ResourceListProps {
  resources: MockResource[];
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          title={resource.title}
          bodySystems={resource.bodySystems}
          tags={resource.tags}
          rating={resource.rating}
          description={resource.description}
        />
      ))}
    </div>
  );
} 