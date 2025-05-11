import { Button } from "@/components/ui/button"
import { ResourceCard } from "@/components/resource-card"

const featuredResources = [
  {
    title: "Adaptive Kitchen Tools Collection",
    category: "Mobility",
    bodySystem: "Upper Limb",
    rating: 5,
    description: "A comprehensive set of kitchen tools designed for people with limited grip strength and dexterity."
  },
  {
    title: "Sensory-Friendly Workplace Guide",
    category: "Sensory Processing",
    bodySystem: "Nervous System",
    rating: 4,
    description: "Step-by-step guide for creating sensory-friendly workplace accommodations."
  },
  {
    title: "Chronic Pain Management App",
    category: "Pain Management",
    bodySystem: "Multiple Systems",
    rating: 4.5,
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
        <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white text-lg py-6 px-8">
          View All Resources
        </Button>
      </div>
    </section>
  )
} 