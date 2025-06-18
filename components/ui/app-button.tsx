import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppButtonVariant = "primary" | "secondary" | "destructive";

interface AppButtonProps extends Omit<ButtonProps, "variant"> {
  appVariant?: AppButtonVariant;
}

const appButtonVariants = {
  primary: {
    base: "bg-[#4CAF50] text-white border-transparent",
    hover: "hover:bg-[#4CAF50]/90",
    disabled: "disabled:bg-[#4CAF50]/50 disabled:text-white/70",
    // High contrast mode support
    highContrast: "contrast-more:bg-green-600 contrast-more:border-2 contrast-more:border-green-800",
  },
  secondary: {
    base: "border-[#B39DDB] text-[#00796B] bg-transparent",
    hover: "hover:bg-[#B39DDB]/20 hover:border-[#B39DDB]/80 hover:text-[#00796B]",
    disabled: "disabled:border-[#B39DDB]/50 disabled:text-[#00796B]/50",
    // High contrast mode support
    highContrast: "contrast-more:border-purple-600 contrast-more:text-purple-800 contrast-more:hover:bg-purple-100",
  },
  destructive: {
    base: "border-red-500 text-red-500 bg-transparent",
    hover: "hover:bg-red-500 hover:text-white hover:border-red-600",
    disabled: "disabled:border-red-300 disabled:text-red-300 disabled:hover:bg-transparent disabled:hover:text-red-300",
    // High contrast mode support
    highContrast: "contrast-more:border-red-700 contrast-more:text-red-800 contrast-more:hover:bg-red-600 contrast-more:hover:text-white",
  },
};

const commonStyles = [
  // Animation styles from landing page
  "hover:shadow-lg",
  "hover:translate-y-[-2px]",
  "active:translate-y-[0px]",
  "transition-all",
  "duration-300",
  "transform-gpu",
  // Accessibility
  "focus:outline-none",
  "focus:ring-2",
  "focus:ring-[#4CAF50]",
  "focus:ring-offset-2",
  "contrast-more:focus:ring-4",
  // Disabled state
  "disabled:transform-none",
  "disabled:shadow-none",
  "disabled:cursor-not-allowed",
];

export function AppButton({ 
  appVariant = "primary", 
  className, 
  children, 
  ...props 
}: AppButtonProps) {
  const variantStyles = appButtonVariants[appVariant];
  
  return (
    <Button
      variant="outline" // Base variant, we'll override with our styles
      className={cn(
        // Common animation and interaction styles
        commonStyles,
        // Variant-specific styles
        variantStyles.base,
        variantStyles.hover,
        variantStyles.disabled,
        variantStyles.highContrast,
        // Custom className
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
} 