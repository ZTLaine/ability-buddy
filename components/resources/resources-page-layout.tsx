'use client';

import React, { useState, useEffect } from "react";
import { ResourceList } from "./resource-list";
import { ResourceFilterSidebar } from "./resource-filter-sidebar";
import { mockResources, masterBodySystems } from "@/lib/mock-data";
import { MockResource, SelectedFilters, FilterSettings } from "@/types/resources";

// Helper to get unique tags from mock data - can also be moved to a shared utils file
const getUniqueTags = (key: "bodySystems" | "tags") => {
  const allTags = mockResources.flatMap(resource => resource[key]);
  return Array.from(new Set(allTags)).sort() as string[];
};

export function ResourcesPageLayout() {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    bodySystems: [],
    tags: [],
  });
  
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    bodySystemsLogic: "AND",
    tagsLogic: "AND",
  });
  
  const [filteredResources, setFilteredResources] = useState<MockResource[]>(mockResources);

  // Use masterBodySystems for body systems (fixed list)
  const uniqueBodySystems = masterBodySystems;
  // Get unique tags from all resources
  const uniqueTags = getUniqueTags("tags");

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

  const handleFilterLogicChange = (type: keyof FilterSettings, value: "AND" | "OR") => {
    setFilterSettings(prevSettings => ({
      ...prevSettings,
      [type]: value,
    }));
  };

  // Updated filtering logic for arrays of bodySystems and tags
  useEffect(() => {
    const { bodySystems: selBodySystems, tags: selTags } = selectedFilters;
    const { bodySystemsLogic, tagsLogic } = filterSettings;

    // If no filters are selected at all, show all resources
    if (selBodySystems.length === 0 && selTags.length === 0) {
      setFilteredResources(mockResources);
      return;
    }

    const newFilteredResources = mockResources.filter(resource => {
      // Check body systems match based on AND/OR logic
      let bodySystemsMatch = true;
      if (selBodySystems.length > 0) {
        if (bodySystemsLogic === "AND") {
          // Resource must have ALL selected body systems
          bodySystemsMatch = selBodySystems.every(system => 
            resource.bodySystems.includes(system)
          );
        } else { // OR logic
          // Resource must have AT LEAST ONE of the selected body systems
          bodySystemsMatch = selBodySystems.some(system => 
            resource.bodySystems.includes(system)
          );
        }
      }

      // Check tags match based on AND/OR logic
      let tagsMatch = true;
      if (selTags.length > 0) {
        if (tagsLogic === "AND") {
          // Resource must have ALL selected tags
          tagsMatch = selTags.every(tag => 
            resource.tags.includes(tag)
          );
        } else { // OR logic
          // Resource must have AT LEAST ONE of the selected tags
          tagsMatch = selTags.some(tag => 
            resource.tags.includes(tag)
          );
        }
      }

      // Resource matches if it passes both the body systems and tags filters
      return bodySystemsMatch && tagsMatch;
    });
    
    setFilteredResources(newFilteredResources);
  }, [selectedFilters, filterSettings]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-3/4">
        <ResourceList resources={filteredResources} />
      </div>
      <aside className="lg:w-1/4">
        <ResourceFilterSidebar 
          selectedFilters={selectedFilters}
          onTagClick={handleTagClick}
          uniqueBodySystems={uniqueBodySystems}
          uniqueTags={uniqueTags}
          filterSettings={filterSettings}
          onFilterLogicChange={handleFilterLogicChange}
        />
      </aside>
    </div>
  );
} 