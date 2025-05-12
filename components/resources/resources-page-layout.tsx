'use client';

import React, { useState, useEffect } from "react";
import { ResourceList } from "./resource-list";
import { ResourceFilterSidebar } from "./resource-filter-sidebar";
import { mockResources, MockResource } from "@/lib/mock-data";

// This interface can be shared or moved to a types file later
export interface SelectedFilters {
  category: string[];
  bodySystem: string[];
}

export type FilterLogic = "AND" | "OR";

// Helper to get unique tags from mock data - can also be moved to a shared utils file
const getUniqueTags = (key: keyof Pick<MockResource, "category" | "bodySystem">) => {
  const allTags = mockResources.map(resource => resource[key]);
  return Array.from(new Set(allTags)).sort() as string[];
};

export function ResourcesPageLayout() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: [],
    bodySystem: [],
  });
  const [filterLogic, setFilterLogic] = useState<FilterLogic>("AND");
  const [filteredResources, setFilteredResources] = useState<MockResource[]>(mockResources);

  const uniqueCategories = getUniqueTags("category");
  const uniqueBodySystems = getUniqueTags("bodySystem");

  const handleTagClick = (type: keyof SelectedFilters, tag: string) => {
    setSelectedFilters(prevFilters => {
      const currentTagsForType = prevFilters[type];
      if (currentTagsForType.includes(tag)) {
        return {
          ...prevFilters,
          [type]: currentTagsForType.filter(t => t !== tag),
        };
      } else {
        return {
          ...prevFilters,
          [type]: [...currentTagsForType, tag],
        };
      }
    });
  };
  
  // Refined useEffect for filtering
  useEffect(() => {
    const { category: selCategory, bodySystem: selBodySystem } = selectedFilters;

    // If no filters are selected at all, show all resources
    if (selCategory.length === 0 && selBodySystem.length === 0) {
      setFilteredResources(mockResources);
      return;
    }

    const newFilteredResources = mockResources.filter(resource => {
      if (filterLogic === "AND") {
        // For AND logic, resource must match selections in all active groups.
        // If a group has no selections, it doesn't filter (evaluates to true for that group).
        const categoryCheck = selCategory.length === 0 || selCategory.includes(resource.category);
        const bodySystemCheck = selBodySystem.length === 0 || selBodySystem.includes(resource.bodySystem);
        return categoryCheck && bodySystemCheck;
      } else { // OR logic
        // For OR logic, resource must match selections in at least one active group.
        let matchesOrCriteria = false;
        // Check category match only if categories are selected
        if (selCategory.length > 0 && selCategory.includes(resource.category)) {
          matchesOrCriteria = true;
        }
        // Check body system match only if body systems are selected and not already matched by category
        if (!matchesOrCriteria && selBodySystem.length > 0 && selBodySystem.includes(resource.bodySystem)) {
          matchesOrCriteria = true;
        }
        return matchesOrCriteria;
      }
    });
    setFilteredResources(newFilteredResources);

  }, [selectedFilters, filterLogic]);


  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content area for resource list */}
      <div className="lg:w-3/4">
        <ResourceList resources={filteredResources} />
      </div>

      {/* Sidebar for filters */}
      <aside className="lg:w-1/4">
        <ResourceFilterSidebar 
          selectedFilters={selectedFilters}
          onTagClick={handleTagClick}
          uniqueCategories={uniqueCategories}
          uniqueBodySystems={uniqueBodySystems}
          filterLogic={filterLogic}
          onFilterLogicChange={setFilterLogic}
        />
      </aside>
    </div>
  );
} 