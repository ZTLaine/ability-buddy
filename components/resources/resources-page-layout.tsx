'use client';

import React, { useState, useEffect, useCallback } from "react";
import { ResourceList } from "./resource-list";
import { ResourceFilterSidebar } from "./resource-filter-sidebar";
import { mockResources, masterBodySystems } from "@/lib/mock-data";
import { MockResource, SelectedFilters, FilterSettings } from "@/types/resources";
import { AddNewResourceButton } from "./add-new-resource-button";

// Helper to get unique tags from mock data - can also be moved to a shared utils file
const getUniqueTags = (key: "bodySystems" | "tags", resources: MockResource[]) => {
  const allTags = resources.flatMap(resource => resource[key]);
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
  
  const [allResources, setAllResources] = useState<MockResource[]>(mockResources);
  const [filteredResources, setFilteredResources] = useState<MockResource[]>(mockResources);

  // Use masterBodySystems for body systems (fixed list)
  const uniqueBodySystems = masterBodySystems;
  // Get unique tags from all resources
  const uniqueTags = getUniqueTags("tags", allResources);

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

  useEffect(() => {
    const { bodySystems: selBodySystems, tags: selTags } = selectedFilters;
    const { bodySystemsLogic, tagsLogic } = filterSettings;

    if (selBodySystems.length === 0 && selTags.length === 0) {
      setFilteredResources(allResources);
      return;
    }

    const newFilteredResources = allResources.filter(resource => {
      let bodySystemsMatch = true;
      if (selBodySystems.length > 0) {
        if (bodySystemsLogic === "AND") {
          bodySystemsMatch = selBodySystems.every(system => 
            resource.bodySystems.includes(system)
          );
        } else { 
          bodySystemsMatch = selBodySystems.some(system => 
            resource.bodySystems.includes(system)
          );
        }
      }

      let tagsMatch = true;
      if (selTags.length > 0) {
        if (tagsLogic === "AND") {
          tagsMatch = selTags.every(tag => 
            resource.tags.includes(tag)
          );
        } else { 
          tagsMatch = selTags.some(tag => 
            resource.tags.includes(tag)
          );
        }
      }
      return bodySystemsMatch && tagsMatch;
    });
    
    setFilteredResources(newFilteredResources);
  }, [selectedFilters, filterSettings, allResources]);

  const handleResourceCreated = useCallback(() => {
    console.log("Resource created, ideally re-fetch or update 'allResources' state here.");
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-[#00796B] relative">
          <span className="relative inline-block">
            Resources
            <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4CAF50]/50 rounded-full"></span>
          </span>
        </h1>
        <AddNewResourceButton onResourceCreated={handleResourceCreated} />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-[#B39DDB]/20">
            <ResourceList resources={filteredResources} />
          </div>
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
    </div>
  );
} 