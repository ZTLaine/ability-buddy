"use client"

import { forwardRef } from "react"
import { Input as ShadcnInput } from "./input"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {}

// This is a wrapped version of the Shadcn Input component that removes any hover transforms
const CustomInput = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <ShadcnInput
      ref={ref}
      className={cn(
        // Override any hover transforms and transitions that might be causing movement
        "hover:translate-y-0 transition-all duration-300", 
        className
      )}
      {...props}
    />
  )
})

CustomInput.displayName = "CustomInput"

export { CustomInput } 