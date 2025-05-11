import React from "react";
import { ResourceList } from "./resource-list";
import { mockResources } from "@/lib/mock-data";

const ResourceFilterSidebarPlaceholder = () => (
  <div className="w-full bg-white/80 p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-teal-default mb-4">Filter Sidebar Area</h2>
    <p className="text-gray-600">Tag filters and other controls will be here.</p>
  </div>
);

export function ResourcesPageLayout() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content area for resource list */}
      <div className="lg:w-3/4">
        <ResourceList resources={mockResources} />
      </div>

      {/* Sidebar for filters */}
      <aside className="lg:w-1/4">
        <ResourceFilterSidebarPlaceholder />
      </aside>
    </div>
  );
} 