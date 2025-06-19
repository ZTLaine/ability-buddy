import { AppButton } from "@/components/ui/app-button"

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
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <AppButton appVariant="primary" className="text-lg py-6 px-8" asChild>
            <a href="/resources">Start Exploring Resources</a>
          </AppButton>
          <AppButton appVariant="secondary" className="text-lg py-6 px-8" asChild>
            <a href="/resources">Create Account to Contribute</a>
          </AppButton>
        </div>
      </div>
    </section>
  )
} 