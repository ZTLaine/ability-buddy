import { Users, Clock, BookOpen, Database } from "lucide-react"

interface BenefitCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
  return (
    <div className="bg-[#FFFDE7] p-6 rounded-lg shadow-md flex flex-col items-center text-center hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
      <div className="bg-[#4CAF50]/10 p-4 rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#00796B] mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

export function BenefitsSection() {
  const benefits = [
    {
      icon: <Users className="h-8 w-8 text-[#4CAF50]" />,
      title: "Community-Verified Solutions",
      description: "Find solutions others have actually used successfully"
    },
    {
      icon: <Clock className="h-8 w-8 text-[#4CAF50]" />,
      title: "Save Valuable Time",
      description: "Save time searching for effective resources"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-[#4CAF50]" />,
      title: "Detailed Information",
      description: "Access detailed information about how to obtain and use resources"
    },
    {
      icon: <Database className="h-8 w-8 text-[#4CAF50]" />,
      title: "Growing Knowledge Base",
      description: "Contribute to a growing knowledge base for the disability community"
    }
  ]

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#00796B] mb-12">
          How Ability Buddy Helps You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-lg text-[#00796B] font-medium">
            Browse resources freely - accounts only needed for contributing
          </p>
        </div>
      </div>
    </section>
  )
} 