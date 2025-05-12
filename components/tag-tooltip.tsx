import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TagTooltipProps {
  items: string[];
  tooltipLabel: string;
  className: string;
  textColor?: string;
}

export function TagTooltip({ items, tooltipLabel, className, textColor = "text-black" }: TagTooltipProps) {
  if (items.length === 0) return null;

  if (items.length === 1) {
    return (
      <Badge className={`${className} ${textColor}`}>
        {items[0]}
      </Badge>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className={`${className} ${textColor}`}>
            {items[0]} +{items.length - 1}
          </Badge>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="bg-white  border border-gray-200 p-3 shadow-lg z-[999] max-w-xs"
          sideOffset={5}
        >
          <div className="space-y-2">
            <p className="font-medium text-teal-default">{tooltipLabel}:</p>
            <ul className="list-disc pl-4 space-y-1">
              {items.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
} 