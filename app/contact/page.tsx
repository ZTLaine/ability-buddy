import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/landing/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppButton } from "@/components/ui/app-button";
import { Mail, MessageCircle, Bug, Lightbulb, Heart, Github, HelpCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      <SiteHeader />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#00796B] mb-4">
              Contact & Feedback
            </h1>
            <p className="text-xl text-gray-700">
              Your input helps make Ability Buddy better for everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Card className="bg-white/70 backdrop-blur-sm border-[#B39DDB]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#00796B] flex items-center gap-2">
                  <Mail className="h-6 w-6" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  As a solo developer running this passion project, I truly value every piece of feedback and every message from the community. Your experiences and suggestions are what drive the continued development of this platform.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-[#03A9F4]/10 rounded-lg">
                    <Bug className="h-5 w-5 text-[#03A9F4]" />
                    <div>
                      <p className="font-medium text-[#00796B]">Bug Reports</p>
                      <p className="text-sm text-gray-600">Technical issues, broken features, or accessibility problems</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#B39DDB]/10 rounded-lg">
                    <Lightbulb className="h-5 w-5 text-[#B39DDB]" />
                    <div>
                      <p className="font-medium text-[#00796B]">Feature Requests</p>
                      <p className="text-sm text-gray-600">Ideas for new features or improvements to existing ones</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#4CAF50]/10 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-[#4CAF50]" />
                    <div>
                      <p className="font-medium text-[#00796B]">General Inquiries</p>
                      <p className="text-sm text-gray-600">Personal questions, partnerships, or general feedback</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Reach Me */}
            <Card className="bg-white/70 backdrop-blur-sm border-[#B39DDB]/20">
              <CardHeader>
                <CardTitle className="text-2xl text-[#00796B] flex items-center gap-2">
                  <Heart className="h-6 w-6" />
                  How to Reach Me
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  I'm committed to being responsive and accessible. Here are the best ways to contact me:
                </p>
                <div className="space-y-4">
                  <div className="p-4 border border-[#03A9F4]/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-[#00796B] flex items-center gap-2">
                        <Github className="h-4 w-4" />
                        GitHub Issues (Preferred for Bugs & Features)
                      </h3>
                      <Collapsible>
                        <CollapsibleTrigger asChild>
                          <button className="text-gray-400 hover:text-[#00796B] transition-colors">
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                          <p className="mb-2 font-medium">New to GitHub? Here's how:</p>
                          <ol className="list-decimal list-inside space-y-1 text-xs">
                            <li>Click the button below to visit GitHub</li>
                            <li>Sign up for a free account if needed</li>
                            <li>Click "New issue" (green button)</li>
                            <li>Choose "Bug report" or "Feature request"</li>
                            <li>Fill out the form and submit</li>
                          </ol>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Best for bug reports and feature requests. Don't worry if you're new to GitHub - it's free and easy!
                    </p>
                    <AppButton appVariant="primary" className="w-full" asChild>
                      <a href="https://github.com/ZTLaine/ability-buddy/issues" target="_blank" rel="noopener noreferrer">
                        Open GitHub Issue
                      </a>
                    </AppButton>
                  </div>
                  <div className="p-4 border border-[#4CAF50]/30 rounded-lg">
                    <h3 className="font-semibold text-[#00796B] mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email (For Everything Else)
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Perfect for general questions, personal feedback, or if you're not comfortable with GitHub
                    </p>
                    <AppButton appVariant="secondary" className="w-full" asChild>
                      <a href="mailto:ztlaine@gmail.com">Send Email</a>
                    </AppButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Expectations */}
          <Card className="bg-[#4CAF50]/10 border-[#4CAF50]/30">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00796B]">What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p className="mb-4">
                As a solo developer balancing this passion project with life and health, here's what you can expect:
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>GitHub Issues:</strong> I'll acknowledge within 1-2 days and provide updates as I work on fixes</li>
                <li><strong>Email Response:</strong> I aim to respond within 2-3 business days, though it may take longer during busy periods or health flares</li>
                <li><strong>Bug Fixes:</strong> Critical accessibility or functionality issues get priority attention</li>
                <li><strong>Feature Requests:</strong> I keep a running list and consider community feedback when prioritizing development</li>
                <li><strong>Personal Touch:</strong> Every message gets read personally - you're not talking to a chatbot or customer service team</li>
              </ul>
              <p className="mt-4">
                Your patience and understanding are greatly appreciated as I work to make this platform the best it can be for our community.
              </p>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="bg-[#B39DDB]/10 border-[#B39DDB]/30">
            <CardHeader>
              <CardTitle className="text-2xl text-[#00796B]">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 leading-relaxed">
              <p>
                This platform exists to support and empower the disability community. When reaching out, please:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-1">
                <li>Be respectful and constructive in your feedback</li>
                <li>Provide specific details when reporting issues (what happened, what you expected, steps to reproduce)</li>
                <li>Remember that this is a community resource built by community members</li>
                <li>Be patient with response times and development timelines</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
} 