"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { HighContrastToggle } from "@/components/high-contrast-toggle"
import { LeafIcon } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"

export function SiteHeader() {
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)

  const openLoginModal = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const openRegisterModal = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const closeModals = () => {
    setShowLoginModal(false)
    setShowRegisterModal(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FFFDE7] shadow-sm border-b border-[#B39DDB]/30 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <LeafIcon className="h-8 w-8 text-[#4CAF50]" />
            <h1 className="text-2xl font-bold text-[#00796B]">Ability Buddy</h1>
          </Link>
          <div className="flex items-center gap-4">
            <HighContrastToggle />
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/resources" className="text-[#00796B] hover:text-[#4CAF50] transition-colors">
                Resources
              </Link>
              <Link href="/about" className="text-[#00796B] hover:text-[#4CAF50] transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-[#00796B] hover:text-[#4CAF50] transition-colors">
                Contact
              </Link>
            </nav>
            <Button
              variant="outline"
              className="hidden md:inline-flex border-[#B39DDB] text-[#00796B] hover:bg-[#B39DDB]/20 hover:border-[#B39DDB]/80 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300"
              onClick={openLoginModal}
            >
              Log In
            </Button>
            <Button
              className="hidden md:inline-flex bg-[#4CAF50] hover:bg-[#4CAF50]/90 hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 text-white"
              onClick={openRegisterModal}
            >
              Sign Up
            </Button>
            <Button variant="ghost" className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#00796B]"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <span className="sr-only">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLoginModal} onClose={closeModals} onSwitchToRegister={openRegisterModal} />

      <RegisterModal isOpen={showRegisterModal} onClose={closeModals} onSwitchToLogin={openLoginModal} />
    </>
  )
}
