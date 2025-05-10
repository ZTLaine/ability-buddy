import { Button } from "@/components/ui/button"
import { Users, Clock, BookOpen, Database } from "lucide-react"
import { NewsletterSignup } from "@/components/newsletter-signup"
import { ResourceCard } from "@/components/resource-card"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { LeafIcon } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      <SiteHeader />

      <main>
        {/* Hero Section */}
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

        {/* Leaf Divider */}
        <div className="relative h-24 overflow-hidden">
          <div className="absolute w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="text-[#4CAF50]/10">
              <path
                fill="currentColor"
                fillOpacity="1"
                d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Benefits Section */}
        <section className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#00796B] mb-12">
              How Ability Buddy Helps You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-[#FFFDE7] p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
                  <Users className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h3 className="text-xl font-semibold text-[#00796B] mb-2">Community-Verified Solutions</h3>
                <p className="text-gray-700">Find solutions others have actually used successfully</p>
              </div>

              <div className="bg-[#FFFDE7] p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h3 className="text-xl font-semibold text-[#00796B] mb-2">Save Valuable Time</h3>
                <p className="text-gray-700">Save time searching for effective resources</p>
              </div>

              <div className="bg-[#FFFDE7] p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
                  <BookOpen className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h3 className="text-xl font-semibold text-[#00796B] mb-2">Detailed Information</h3>
                <p className="text-gray-700">Access detailed information about how to obtain and use resources</p>
              </div>

              <div className="bg-[#FFFDE7] p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
                  <Database className="h-8 w-8 text-[#4CAF50]" />
                </div>
                <h3 className="text-xl font-semibold text-[#00796B] mb-2">Growing Knowledge Base</h3>
                <p className="text-gray-700">Contribute to a growing knowledge base for the disability community</p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg text-[#00796B] font-medium">
                Browse resources freely - accounts only needed for contributing
              </p>
            </div>
          </div>
        </section>

        {/* Featured Resources Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#00796B] mb-12">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ResourceCard
              title="Adaptive Kitchen Tools Collection"
              category="Mobility"
              bodySystem="Upper Limb"
              rating={5}
              description="A comprehensive set of kitchen tools designed for people with limited grip strength and dexterity."
            />
            <ResourceCard
              title="Sensory-Friendly Workplace Guide"
              category="Sensory Processing"
              bodySystem="Nervous System"
              rating={4}
              description="Step-by-step guide for creating sensory-friendly workplace accommodations."
            />
            <ResourceCard
              title="Chronic Pain Management App"
              category="Pain Management"
              bodySystem="Multiple Systems"
              rating={4.5}
              description="Mobile application with tracking tools and community support for chronic pain conditions."
            />
          </div>
          <div className="mt-12 text-center">
            <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white text-lg py-6 px-8">
              View All Resources
            </Button>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-[#03A9F4]/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#00796B] mb-4">Join Our Community Today</h2>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Help build a comprehensive resource library that makes life easier for people with disabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white text-lg py-6 px-8">
                Start Exploring Resources
              </Button>
              <Button
                variant="outline"
                className="border-[#B39DDB] text-[#00796B] hover:bg-[#B39DDB]/20 hover:border-[#B39DDB]/80 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-lg py-6 px-8"
              >
                Create Account to Contribute
              </Button>
            </div>

            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-[#00796B] mb-4">Stay Updated on New Resources</h3>
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#00796B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <LeafIcon className="h-6 w-6 text-white" />
                <h2 className="text-xl font-bold">Ability Buddy</h2>
              </div>
              <p className="text-white/80">
                A community-driven resource sharing platform for the disability community.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
                    Categories
                  </Link>
                </li>
                <li>
                  <Link href="/body-systems" className="text-white/80 hover:text-white transition-colors">
                    Body Systems
                  </Link>
                </li>
                <li>
                  <Link href="/top-rated" className="text-white/80 hover:text-white transition-colors">
                    Top Rated
                  </Link>
                </li>
                <li>
                  <Link href="/recently-added" className="text-white/80 hover:text-white transition-colors">
                    Recently Added
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/mission" className="text-white/80 hover:text-white transition-colors">
                    Our Mission
                  </Link>
                </li>
                <li>
                  <Link href="/team" className="text-white/80 hover:text-white transition-colors">
                    Team
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="text-white/80 hover:text-white transition-colors">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com/abilitybuddy"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://facebook.com/abilitybuddy"
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60">
            <p>© {new Date().getFullYear()} Ability Buddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
