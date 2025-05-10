"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function HighContrastToggle() {
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Check if user has previously set high contrast mode
    const savedPreference = localStorage.getItem("high-contrast-mode")
    if (savedPreference === "true") {
      setHighContrast(true)
      document.documentElement.classList.add("high-contrast")
    }
  }, [])

  const toggleHighContrast = () => {
    const newState = !highContrast
    setHighContrast(newState)

    if (newState) {
      document.documentElement.classList.add("high-contrast")
      localStorage.setItem("high-contrast-mode", "true")
    } else {
      document.documentElement.classList.remove("high-contrast")
      localStorage.setItem("high-contrast-mode", "false")
    }
  }

  return (
    <Button
      variant={highContrast ? "default" : "outline"}
      size="icon"
      onClick={toggleHighContrast}
      aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
      title={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
      className={`relative transition-all duration-300 ${
        highContrast ? "bg-yellow-500 text-black" : "text-[#00796B] border-[#B39DDB]"
      }`}
    >
      {highContrast ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      <span className="sr-only">{highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}</span>
    </Button>
  )
}
