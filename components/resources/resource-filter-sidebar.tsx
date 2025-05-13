'use client';

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { XIcon, HelpCircleIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
    <div className="w-full bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md space-y-6 sticky top-24 border border-[#B39DDB]/20">
      <div className="relative">
        <div className="flex items-center mb-3 pb-2 border-b border-[#4CAF50]/30">
          <h3 className="text-lg font-semibold text-teal-default">Selected Filters</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="ml-2 text-gray-400 hover:text-[#00796B]">
                  <HelpCircleIcon size={16} />
                </button>
              </TooltipTrigger>
              <TooltipContent className="bg-white border border-gray-200 p-3 shadow-lg z-[999] max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium text-teal-default">Filter Logic Explained:</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">ALL (AND):</span> Resources must match all selected filters in a group.
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">ANY (OR):</span> Resources must match at least one selected filter in a group.
                  </p>
                  <p className="text-xs text-gray-600">
                    Both body systems and tags use their own logic settings.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
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
        <AccordionItem value="body-systems" className="border-[#4CAF50]/30">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark group">
            <span className="group-hover:underline decoration-[#4CAF50]/40 decoration-2 underline-offset-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#4CAF50] mr-2"></span>
              Body Systems
            </span>
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
                  className="data-[state=checked]:bg-[#4CAF50] data-[state=unchecked]:bg-[#4CAF50]/30"
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
        <AccordionItem value="tags" className="border-[#B39DDB]/30">
          <AccordionTrigger className="text-md font-medium text-teal-default hover:text-teal-dark group">
            <span className="group-hover:underline decoration-[#B39DDB]/40 decoration-2 underline-offset-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#B39DDB] mr-2"></span>
              Tags
            </span>
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
                  className="data-[state=checked]:bg-[#B39DDB] data-[state=unchecked]:bg-[#B39DDB]/30"
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
    </div>
  );
} 