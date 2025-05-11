import { Button } from "@/components/ui/button"
import { NewsletterSignup } from "@/components/newsletter-signup"

export function CTASection() {
  return (
    <section className="bg-[#03A9F4]/10 py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#00796B] mb-4">
          Join Our Community Today
        </h2>
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
          <h3 className="text-xl font-semibold text-[#00796B] mb-4">
            Stay Updated on New Resources
          </h3>
          <NewsletterSignup />
        </div>
      </div>
    </section>
  )
} 