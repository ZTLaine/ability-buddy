import { SiteHeader } from "@/components/site-header";
import { ResourcesPageLayout } from "@/components/resources/resources-page-layout";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-cream-default leaf-pattern flex flex-col">
      <SiteHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ResourcesPageLayout />
      </main>
      {/* We can add a Footer component here later if needed, similar to the landing page */}
    </div>
  );
} 