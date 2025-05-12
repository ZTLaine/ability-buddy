'use client';

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { mockResources, MockResource } from "@/lib/mock-data"; // To get available tags
import { XIcon } from "lucide-react"; // For remove tag button
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { SelectedFilters, FilterLogic } from "./resources-page-layout";

// Helper to get unique tags from mock data
const getUniqueTags = (key: keyof Pick<MockResource, "category" | "bodySystem">) => {
  const allTags = mockResources.map(resource => resource[key]);
  return Array.from(new Set(allTags)).sort() as string[];
};

interface ResourceFilterSidebarProps {
  selectedFilters: SelectedFilters;
  onTagClick: (type: keyof SelectedFilters, tag: string) => void;
  uniqueCategories: string[];
  uniqueBodySystems: string[];
  filterLogic: FilterLogic;
  onFilterLogicChange: (logic: FilterLogic) => void;
}

export function ResourceFilterSidebar({
  selectedFilters,
  onTagClick,
  uniqueCategories,
  uniqueBodySystems,
  filterLogic,
  onFilterLogicChange
}: ResourceFilterSidebarProps) {
  
  const isTagSelected = (type: keyof SelectedFilters, tag: string) => {
    return selectedFilters[type].includes(tag);
  };

  return (
    <div className="w-full bg-white/80 p-6 rounded-lg shadow-md space-y-6 sticky top-24">
      <div>
        <h3 className="text-lg font-semibold text-teal-default mb-3">Selected Filters</h3>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
          {Object.entries(selectedFilters).flatMap(([type, tags]: [string, string[]]) => 
            tags.map((tag: string) => (
              <Badge 
                key={`${type}-${tag}`} 
                variant="secondary" 
                className="bg-yellow-default/30 text-yellow-darker hover:bg-yellow-default/40 pr-2 transition-all duration-200 group cursor-pointer"
                onClick={() => onTagClick(type as keyof SelectedFilters, tag)}
              >
                {tag}
                <XIcon className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
              </Badge>
            ))
          )}
          {selectedFilters.category.length === 0 && selectedFilters.bodySystem.length === 0 && (
            <p className="text-sm text-gray-500">No filters selected.</p>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "body-systems"]} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark">
            Categories
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {uniqueCategories.map(category => (
                <Badge 
                  key={category} 
                  variant={isTagSelected("category", category) ? "default" : "outline"} 
                  className={`cursor-pointer transition-colors duration-200 border-gray-300 
                              ${isTagSelected("category", category) 
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 border-primary'
                                : 'text-gray-700 hover:bg-primary/10 hover:border-primary'}`}
                  onClick={() => onTagClick("category", category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="body-systems">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark">
            Body Systems
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="flex flex-wrap gap-2">
              {uniqueBodySystems.map(system => (
                <Badge 
                  key={system} 
                  variant={isTagSelected("bodySystem", system) ? "default" : "outline"} 
                  className={`cursor-pointer transition-colors duration-200 border-gray-300 
                              ${isTagSelected("bodySystem", system) 
                                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90 border-secondary'
                                : 'text-gray-700 hover:bg-secondary/10 hover:border-secondary'}`}
                  onClick={() => onTagClick("bodySystem", system)}
                >
                  {system}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>
        <h3 className="text-lg font-semibold text-teal-default mb-3">Filter Logic</h3>
        <div className="flex items-center space-x-2 mb-2">
          <Label htmlFor="filter-logic-toggle" className={filterLogic === 'OR' ? "text-gray-500" : "text-teal-dark font-medium"}>
            Match ALL tags (AND)
          </Label>
          <Switch 
            id="filter-logic-toggle"
            checked={filterLogic === 'OR'}
            onCheckedChange={(checked) => onFilterLogicChange(checked ? 'OR' : 'AND')}
            aria-label={`Switch to ${filterLogic === 'AND' ? 'OR' : 'AND'} logic`}
          />
          <Label htmlFor="filter-logic-toggle" className={filterLogic === 'AND' ? "text-gray-500" : "text-teal-dark font-medium"}>
            Match ANY tag (OR)
          </Label>
        </div>
        <p className="text-xs text-gray-500">
          AND: Shows resources matching all selected criteria within each group (e.g., Category A AND Body System X).
          <br />
          OR: Shows resources matching any selected criteria across all groups (e.g., Category A OR Body System X).
        </p>
      </div>
    </div>
  );
} 