import { AppButton } from "@/components/ui/app-button"
import { FlowingAnimation } from "./flowing-animation"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <FlowingAnimation />
      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-[#00796B] leading-tight">
              Discover Resources That Work for Your Disability
            </h2>
            <p className="mt-4 text-xl text-gray-700">
              A community-driven library of practical solutions, tools, and services
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <AppButton appVariant="primary" className="text-lg py-6 px-8">
                Explore Resources
              </AppButton>
              <AppButton appVariant="secondary" className="text-lg py-6 px-8">
                Share Your Finds
              </AppButton>
            </div>
          </div>
          <div className="relative">
            {/* Optional: Add some content here or leave empty for full background effect */}
          </div>
        </div>
      </div>
    </section>
  )
} 