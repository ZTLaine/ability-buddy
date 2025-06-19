import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      <SiteHeader />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#00796B] mb-4">
              About Ability Buddy
            </h1>
            <p className="text-xl text-gray-700">
              A passion project born from lived experience and a desire to help others
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-[#4CAF50]/10 border-[#4CAF50]/30">
              <CardHeader className="text-center">
                <Heart className="h-8 w-8 text-[#4CAF50] mx-auto mb-2" />
                <CardTitle className="text-[#00796B]">Passion-Driven</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700">Built from personal experience navigating disability and health challenges</p>
              </CardContent>
            </Card>

            <Card className="bg-[#03A9F4]/10 border-[#03A9F4]/30">
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-[#03A9F4] mx-auto mb-2" />
                <CardTitle className="text-[#00796B]">Community-First</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700">Designed by and for the disability community to share what actually works</p>
              </CardContent>
            </Card>

            <Card className="bg-[#B39DDB]/10 border-[#B39DDB]/30">
              <CardHeader className="text-center">
                <Lightbulb className="h-8 w-8 text-[#B39DDB] mx-auto mb-2" />
                <CardTitle className="text-[#00796B]">Solution-Focused</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-700">Practical resources and solutions that make daily life easier</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/70 backdrop-blur-sm border-[#B39DDB]/20">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00796B]">My Story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Hi, I'm just a "scrungly little disabled guy" (as I like to describe myself) who got tired of spending countless hours searching for resources that might actually work for my health conditions. Like many of us in the disability community, I've been on a long journey of trial and error, doctor visits, and endless internet searches trying to find solutions that make daily life a little easier.
              </p>
              <p>
                After years of struggling to find reliable information about what tools, services, and resources actually help people with disabilities, I realized that the most valuable recommendations often came from other disabled people who had tried things themselves. We're the real experts on what works and what doesn't.
              </p>
              <p>
                That's when Ability Buddy was born - not as a grand business venture, but as a passion project to create the resource library I wish I'd had access to years ago. A place where we can share what actually works, save each other time and frustration, and build a community around practical solutions.
              </p>
              <p>
                This platform is my way of giving back to a community that has given me so much support and understanding. Every resource shared here has the potential to make someone's life a little easier, and that's what keeps me motivated to keep building and improving this space.
              </p>
              <p>
                I'm not a big company or organization - just one person with lived experience who believes that when we share our knowledge with each other, we all become more capable and empowered.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#4CAF50]/10 border-[#4CAF50]/30">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00796B]">The Vision</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                My dream is for Ability Buddy to become a trusted resource where anyone dealing with disability can find community-verified solutions, tools, and services. I want to create a space where:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>People can find resources that others have actually used and recommend for their specific issue</li>
                <li>We can save each other time by sharing what works (and what doesn't)</li>
                <li>The lived experience of our community becomes a powerful knowledge base</li>
                <li>Everyone feels empowered to contribute their own discoveries</li>
              </ul>
              <p className="mt-4">
                This is a labor of love, and I'm committed to keeping it community-focused and accessible to everyone who needs it.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 