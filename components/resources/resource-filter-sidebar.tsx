'use client';

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react"; // For remove tag button
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { SelectedFilters, FilterSettings } from "@/types/resources";

interface ResourceFilterSidebarProps {
  selectedFilters: SelectedFilters;
  onTagClick: (type: keyof SelectedFilters, tag: string) => void;
  uniqueBodySystems: string[];
  uniqueTags: string[];
  filterSettings: FilterSettings;
  onFilterLogicChange: (type: keyof FilterSettings, value: "AND" | "OR") => void;
}

export function ResourceFilterSidebar({
  selectedFilters,
  onTagClick,
  uniqueBodySystems,
  uniqueTags,
  filterSettings,
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
                className={`pr-2 transition-all duration-200 group cursor-pointer ${
                  type === "bodySystems" 
                    ? "bg-[#4CAF50]/30 text-[#00796B] hover:bg-[#4CAF50]/40" 
                    : "bg-[#B39DDB]/30 text-black hover:bg-[#B39DDB]/40"
                }`}
                onClick={() => onTagClick(type as keyof SelectedFilters, tag)}
              >
                {type === "bodySystems" ? "System: " : "Tag: "}{tag}
                <XIcon className="ml-1.5 h-3 w-3 opacity-70 group-hover:opacity-100" />
              </Badge>
            ))
          )}
          {selectedFilters.bodySystems.length === 0 && selectedFilters.tags.length === 0 && (
            <p className="text-sm text-gray-500">No filters selected.</p>
          )}
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["body-systems", "tags"]} className="w-full">
        {/* Body Systems Section */}
        <AccordionItem value="body-systems">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark">
            Body Systems
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body-systems-logic-toggle" className="text-sm">Filter Logic:</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="body-systems-logic-toggle" className={filterSettings.bodySystemsLogic === 'OR' ? "text-gray-500 text-xs" : "text-teal-default text-xs font-medium"}>
                  ALL
                </Label>
                <Switch 
                  id="body-systems-logic-toggle"
                  checked={filterSettings.bodySystemsLogic === 'OR'}
                  onCheckedChange={(checked) => onFilterLogicChange("bodySystemsLogic", checked ? 'OR' : 'AND')}
                  aria-label="Toggle between AND and OR logic for body systems"
                />
                <Label htmlFor="body-systems-logic-toggle" className={filterSettings.bodySystemsLogic === 'AND' ? "text-gray-500 text-xs" : "text-teal-default text-xs font-medium"}>
                  ANY
                </Label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueBodySystems.map(system => (
                <Badge 
                  key={system} 
                  variant={isTagSelected("bodySystems", system) ? "default" : "outline"} 
                  className={`cursor-pointer transition-colors duration-200 border-gray-300 
                              ${isTagSelected("bodySystems", system) 
                                ? 'bg-[#4CAF50] hover:bg-[#4CAF50]/90 border-[#4CAF50] text-white'
                                : 'text-gray-700 hover:bg-[#4CAF50]/10 hover:border-[#4CAF50]'}`}
                  onClick={() => onTagClick("bodySystems", system)}
                >
                  {system}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tags Section */}
        <AccordionItem value="tags">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark">
            Tags
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="tags-logic-toggle" className="text-sm">Filter Logic:</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="tags-logic-toggle" className={filterSettings.tagsLogic === 'OR' ? "text-gray-500 text-xs" : "text-teal-default text-xs font-medium"}>
                  ALL
                </Label>
                <Switch 
                  id="tags-logic-toggle"
                  checked={filterSettings.tagsLogic === 'OR'}
                  onCheckedChange={(checked) => onFilterLogicChange("tagsLogic", checked ? 'OR' : 'AND')}
                  aria-label="Toggle between AND and OR logic for tags"
                />
                <Label htmlFor="tags-logic-toggle" className={filterSettings.tagsLogic === 'AND' ? "text-gray-500 text-xs" : "text-teal-default text-xs font-medium"}>
                  ANY
                </Label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {uniqueTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={isTagSelected("tags", tag) ? "default" : "outline"} 
                  className={`cursor-pointer transition-colors duration-200 border-gray-300 
                              ${isTagSelected("tags", tag) 
                                ? 'bg-[#B39DDB] hover:bg-[#B39DDB]/90 border-[#B39DDB] text-black'
                                : 'text-gray-700 hover:bg-[#B39DDB]/10 hover:border-[#B39DDB]'}`}
                  onClick={() => onTagClick("tags", tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="text-xs text-gray-600 mt-4 space-y-2">
        <p className="font-medium text-teal-default">Filter Logic Explained:</p>
        <p>
          <span className="font-semibold">ALL (AND):</span> Resources must match all selected filters in a group.
        </p>
        <p>
          <span className="font-semibold">ANY (OR):</span> Resources must match at least one selected filter in a group.
        </p>
        <p>
          Both body systems and tags use their own logic settings.
        </p>
      </div>
    </div>
  );
} 