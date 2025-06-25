"use client"

import Link from "next/link"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { AppButton } from "@/components/ui/app-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HighContrastToggle } from "@/components/high-contrast-toggle"
import { LeafIcon } from "lucide-react"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { Icons } from "@/components/icons"

export function SiteHeader() {
  const { data: session, status } = useSession()
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

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" })
  }

  let authRelatedElements: React.ReactNode

  if (status === "loading") {
    authRelatedElements = (
      <div className="h-9 w-20 animate-pulse bg-gray-200 rounded-md hidden md:inline-flex"></div>
    )
  } else if (session) {
    authRelatedElements = (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full hover:bg-[#B39DDB]/20"
          >
            <Icons.userCircle className="h-7 w-7 text-[#00796B]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white border-[#B39DDB]/50 rounded-lg shadow-lg" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-[#00796B]">
                {session.user?.name || "Anonymous User"}
              </p>
              <p className="text-xs leading-none text-gray-500">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#B39DDB]/30" />
          <DropdownMenuItem
            onClick={handleLogout}
            className="text-[#00796B] hover:!bg-[#B39DDB]/20 hover:!text-[#00796B] focus:bg-[#B39DDB]/20 focus:text-[#00796B] rounded-md cursor-pointer"
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  } else {
    authRelatedElements = (
      <>
        <AppButton
          appVariant="secondary"
          className="hidden md:inline-flex"
          onClick={openLoginModal}
        >
          Log In
        </AppButton>
        <AppButton
          appVariant="primary"
          className="hidden md:inline-flex"
          onClick={openRegisterModal}
        >
          Sign Up
        </AppButton>
      </>
    )
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

            {authRelatedElements}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
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
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-[#B39DDB]/50 rounded-lg shadow-lg" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/resources" className="text-[#00796B] hover:!bg-[#B39DDB]/20 hover:!text-[#00796B] focus:bg-[#B39DDB]/20 focus:text-[#00796B] rounded-md cursor-pointer">
                    Resources
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="text-[#00796B] hover:!bg-[#B39DDB]/20 hover:!text-[#00796B] focus:bg-[#B39DDB]/20 focus:text-[#00796B] rounded-md cursor-pointer">
                    About
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact" className="text-[#00796B] hover:!bg-[#B39DDB]/20 hover:!text-[#00796B] focus:bg-[#B39DDB]/20 focus:text-[#00796B] rounded-md cursor-pointer">
                    Contact
                  </Link>
                </DropdownMenuItem>
                
                {/* Mobile Auth Buttons - Only show for non-logged-in users */}
                {!session && (
                  <>
                    <DropdownMenuSeparator className="bg-[#B39DDB]/30" />
                    <div className="px-2 py-2 space-y-2">
                      <AppButton
                        appVariant="secondary"
                        className="w-full"
                        onClick={openLoginModal}
                      >
                        Log In
                      </AppButton>
                      <AppButton
                        appVariant="primary"
                        className="w-full"
                        onClick={openRegisterModal}
                      >
                        Sign Up
                      </AppButton>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {status !== "authenticated" && (
        <>
          <LoginModal isOpen={showLoginModal} onClose={closeModals} onSwitchToRegister={openRegisterModal} />
          <RegisterModal isOpen={showRegisterModal} onClose={closeModals} onSwitchToLogin={openLoginModal} />
        </>
      )}
    </>
  )
}
