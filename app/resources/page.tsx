import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { ResourcesPageLayout } from "@/components/resources/resources-page-layout";

// Force this page to be dynamic for search params
export const dynamic = 'force-dynamic';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-cream-default leaf-pattern flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-center py-12">Loading resources...</div>}>
          <ResourcesPageLayout />
        </Suspense>
      </main>
      {/* We can add a Footer component here later if needed, similar to the landing page */}
    </div>
  );
} 