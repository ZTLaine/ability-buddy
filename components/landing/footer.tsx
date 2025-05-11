import Link from "next/link"
import { LeafIcon } from "lucide-react"

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

function FooterLink({ href, children }: FooterLinkProps) {
  return (
    <li>
      <Link href={href} className="text-white/80 hover:text-white transition-colors">
        {children}
      </Link>
    </li>
  )
}

export function Footer() {
  return (
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
              <FooterLink href="/categories">Categories</FooterLink>
              <FooterLink href="/body-systems">Body Systems</FooterLink>
              <FooterLink href="/top-rated">Top Rated</FooterLink>
              <FooterLink href="/recently-added">Recently Added</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              <FooterLink href="/mission">Our Mission</FooterLink>
              <FooterLink href="/team">Team</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2">
              <FooterLink href="/contact">Contact Us</FooterLink>
              <FooterLink href="/feedback">Feedback</FooterLink>
              <FooterLink href="https://twitter.com/abilitybuddy">Twitter</FooterLink>
              <FooterLink href="https://facebook.com/abilitybuddy">Facebook</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/20 text-center text-white/60">
          <p>© {new Date().getFullYear()} Ability Buddy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 