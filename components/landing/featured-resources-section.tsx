import { Button } from "@/components/ui/button"
import { ResourceCard } from "@/components/resource-card"
import { ResourceCardProps } from "@/types/resources"

const featuredResources: ResourceCardProps[] = [
  {
    title: "Adaptive Kitchen Tools Collection",
    bodySystems: ["Musculoskeletal"],
    tags: ["Mobility Aid", "Kitchen Tool", "Daily Living"],
    likesCount: 24,
    isSupported: true, // User has supported this resource - shows flower
    description: "A comprehensive set of kitchen tools designed for people with limited grip strength and dexterity."
  },
  {
    title: "Sensory-Friendly Workplace Guide",
    bodySystems: ["Neurological", "Auditory"],
    tags: ["Sensory Processing", "Workplace Accommodation", "Guide"],
    likesCount: 18,
    isSupported: false, // User hasn't supported this - shows sprout
    description: "Step-by-step guide for creating sensory-friendly workplace accommodations."
  },
  {
    title: "Chronic Pain Management App",
    bodySystems: ["Neurological", "Musculoskeletal"],
    tags: ["Pain Management", "Mobile App", "Self-care"],
    likesCount: 31,
    isSupported: true, // User has supported this resource - shows flower
    description: "Mobile application with tracking tools and community support for chronic pain conditions."
  }
]

export function FeaturedResourcesSection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-[#00796B] mb-12">
        Featured Resources
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredResources.map((resource, index) => (
          <ResourceCard key={index} {...resource} />
        ))}
      </div>
      <div className="mt-12 text-center">
        <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white text-lg py-6 px-8" asChild>
          <a href="/resources">View All Resources</a>
        </Button>
      </div>
    </section>
  )
} 