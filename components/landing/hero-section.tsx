import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#00796B] leading-tight">
            Discover Resources That Work for Your Disability
          </h2>
          <p className="mt-4 text-xl text-gray-700">
            A community-driven library of practical solutions, tools, and services
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white text-lg py-6 px-8">
              Explore Resources
            </Button>
            <Button
              variant="outline"
              className="border-[#B39DDB] text-[#00796B] hover:bg-[#B39DDB]/20 hover:border-[#B39DDB]/80 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-lg py-6 px-8"
            >
              Share Your Finds
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full bg-[#03A9F4]/10"></div>
          <img
            src="/placeholder.svg?height=400&width=500"
            alt="Diverse people accessing disability resources with nature-inspired elements"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  )
} 