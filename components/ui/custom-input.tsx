"use client"

import { forwardRef } from "react"
import { Input as ShadcnInput, InputProps } from "./input"
import { cn } from "@/lib/utils"

// This is a wrapped version of the Shadcn Input component that removes any hover transforms
const CustomInput = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <ShadcnInput
      ref={ref}
      className={cn(
        // Override any hover transforms and transitions that might be causing movement
        "hover:translate-y-0 transition-colors transition-opacity duration-300", 
        className
      )}
      {...props}
    />
  )
})

CustomInput.displayName = "CustomInput"

export { CustomInput } 