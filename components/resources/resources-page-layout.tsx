'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ResourceList } from "./resource-list";
import { ResourceFilterSidebar } from "./resource-filter-sidebar";
import { ResourceDetailView } from "./resource-detail-view";
import { masterBodySystems } from "@/lib/mock-data";
import type { SelectedFilters, FilterSettings, Resource } from "@/types/resources";
import { AddNewResourceButton } from "./add-new-resource-button";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FilterIcon } from "lucide-react";

// Helper to get unique tags from API data
const getUniqueTagsFromResources = (resources: Resource[]): string[] => {
  const allTags = resources.flatMap(resource => resource.tags.map(rt => rt.tag.name));
  return Array.from(new Set(allTags)).sort();
};

// Helper to get unique body systems from API data (if needed, though masterBodySystems is primary for UI)
const getUniqueBodySystemsFromResources = (resources: Resource[]): string[] => {
  const allSystems = resources.flatMap(resource => resource.bodySystems || []);
  return Array.from(new Set(allSystems)).sort();
};

export function ResourcesPageLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedResourceId = searchParams.get('id');

  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    bodySystems: [],
    tags: [],
  });
  
  const [filterSettings, setFilterSettings] = useState<FilterSettings>({
    bodySystemsLogic: "AND",
    tagsLogic: "AND",
  });
  
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Use masterBodySystems for body systems filter options
  const uniqueBodySystemsForFilter = masterBodySystems;
  // Get unique tags from all resources for filter options
  const [uniqueTagsForFilter, setUniqueTagsForFilter] = useState<string[]>([]);

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/resources");
      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }
      const data: Resource[] = await response.json();
      setAllResources(data);
      setFilteredResources(data);
      setUniqueTagsForFilter(getUniqueTagsFromResources(data));
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Close mobile filter dropdown when screen expands to desktop size
  useEffect(() => {
    const handleResize = () => {
      // lg breakpoint is 1024px in Tailwind
      if (window.innerWidth >= 1024 && isMobileFilterOpen) {
        setIsMobileFilterOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileFilterOpen]);

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
        const resourceBodySystems = resource.bodySystems || [];
        if (bodySystemsLogic === "AND") {
          bodySystemsMatch = selBodySystems.every(system => 
            resourceBodySystems.includes(system)
          );
        } else { 
          bodySystemsMatch = selBodySystems.some(system => 
            resourceBodySystems.includes(system)
          );
        }
      }

      let tagsMatch = true;
      if (selTags.length > 0) {
        const resourceTagNames = resource.tags.map(rt => rt.tag.name);
        if (tagsLogic === "AND") {
          tagsMatch = selTags.every(tag => 
            resourceTagNames.includes(tag)
          );
        } else { 
          tagsMatch = selTags.some(tag => 
            resourceTagNames.includes(tag)
          );
        }
      }
      return bodySystemsMatch && tagsMatch;
    });
    
    setFilteredResources(newFilteredResources);
  }, [selectedFilters, filterSettings, allResources]);

  const handleResourceCreated = useCallback(() => {
    fetchResources();
  }, [fetchResources]);

  // Get the selected resource from our data
  const selectedResource = selectedResourceId 
    ? allResources.find(resource => resource.id === selectedResourceId)
    : null;

  // If we have a selected resource ID but can't find it in our data, fetch it individually
  const [selectedResourceData, setSelectedResourceData] = useState<Resource | null>(null);
  const [isLoadingSelectedResource, setIsLoadingSelectedResource] = useState(false);

  useEffect(() => {
    if (selectedResourceId && !selectedResource && !isLoadingSelectedResource) {
      setIsLoadingSelectedResource(true);
      fetch(`/api/resources/${selectedResourceId}`)
        .then(response => response.json())
        .then(data => {
          setSelectedResourceData(data);
        })
        .catch(error => {
          console.error('Error fetching selected resource:', error);
          // If resource not found, redirect back to list
          router.push('/resources');
        })
        .finally(() => {
          setIsLoadingSelectedResource(false);
        });
    } else if (!selectedResourceId) {
      setSelectedResourceData(null);
    }
  }, [selectedResourceId, selectedResource, isLoadingSelectedResource, router]);

  // Use the selected resource from our data or the individually fetched one
  const displayResource = selectedResource || selectedResourceData;

  const handleResourceSelect = (resourceId: string) => {
    // Update URL without page reload
    const newUrl = `/resources?id=${resourceId}`;
    router.push(newUrl, { scroll: false });
  };

  const handleBackToList = () => {
    // Clear the selection and go back to list
    router.push('/resources', { scroll: false });
  };

  const handleResourceDeleted = () => {
    // Refresh the resources list
    fetchResources();
  };

  const handleResourceUpdated = () => {
    // Refresh the resources list
    fetchResources();
  };

  // Get count of active filters for mobile button
  const getActiveFilterCount = () => {
    return selectedFilters.bodySystems.length + selectedFilters.tags.length;
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading resources...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error loading resources: {error}</div>;
  }

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
          {/* Mobile Filter Button - Only show when not viewing a specific resource */}
          {!displayResource && (
            <div className="lg:hidden mb-4">
              <DropdownMenu open={isMobileFilterOpen} onOpenChange={setIsMobileFilterOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 bg-white/70 backdrop-blur-sm border-[#B39DDB]/30 hover:bg-[#B39DDB]/10"
                  >
                    <FilterIcon size={16} />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <span className="bg-[#4CAF50] text-white text-xs px-2 py-1 rounded-full ml-1">
                        {getActiveFilterCount()}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-80 max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-white/70 backdrop-blur-sm rounded-xl border border-[#B39DDB]/50 shadow-md"
                  sideOffset={4}
                  collisionPadding={16}
                  avoidCollisions={true}
                >
                  <div className="p-4">
                    <ResourceFilterSidebar 
                      selectedFilters={selectedFilters}
                      onTagClick={handleTagClick}
                      uniqueBodySystems={uniqueBodySystemsForFilter}
                      uniqueTags={uniqueTagsForFilter}
                      filterSettings={filterSettings}
                      onFilterLogicChange={handleFilterLogicChange}
                    />
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-[#B39DDB]/20">
            {displayResource ? (
              <ResourceDetailView 
                resource={displayResource}
                onBack={handleBackToList}
                onResourceDeleted={handleResourceUpdated}
              />
            ) : isLoadingSelectedResource ? (
              <div className="text-center py-12">Loading resource details...</div>
            ) : (
              <ResourceList 
                resources={filteredResources} 
                onResourceSelect={handleResourceSelect}
              />
            )}
          </div>
        </div>
        
        {/* Desktop Filter Sidebar - Hidden on mobile */}
        <aside className="hidden lg:block lg:w-1/4">
          <ResourceFilterSidebar 
            selectedFilters={selectedFilters}
            onTagClick={handleTagClick}
            uniqueBodySystems={uniqueBodySystemsForFilter}
            uniqueTags={uniqueTagsForFilter}
            filterSettings={filterSettings}
            onFilterLogicChange={handleFilterLogicChange}
          />
        </aside>
      </div>
    </div>
  );
} 