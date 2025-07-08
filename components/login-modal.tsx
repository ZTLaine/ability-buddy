"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"
import { Icons } from "@/components/icons"
import { LoginSchema, type LoginFormData } from "@/lib/schemas/auth"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"
import { useModalHeight } from "@/hooks/use-modal-height"
import { createModalConfig, modalTitleStyles, modalDescriptionStyles } from "@/lib/modal-config"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  
  const modalHeight = useModalHeight({ isOpen, dependencies: [errors] })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = LoginSchema.parse(formData)

      // Use NextAuth signIn method for credentials
      const result = await signIn("credentials", {
        redirect: false,
        email: validatedData.email,
        password: validatedData.password,
      })

      if (result?.error) {
        setErrors({ form: result.error === "CredentialsSignin" ? "Invalid email or password." : result.error })
      } else if (result?.ok) {
        onClose()
        router.push("/resources")
        router.refresh()
      } else {
        setErrors({ form: "Unexpected error during login. Please try again." })
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        err.errors.forEach((error) => {
          if (error.path[0]) {
            newErrors[error.path[0].toString()] = error.message
          }
        })
        setErrors(newErrors)
      } else {
        setErrors({ form: "An unexpected error occurred. Please try again." })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset modal state when closed
  useEffect(() => {
    if (!isOpen) {
      setFormData({ email: "", password: "" });
      setShowPassword(false);
      setRememberMe(false);
      setErrors({});
      setShowForgotPassword(false);
    }
  }, [isOpen]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)
    setErrors({})
    try {
      await signIn("google", { callbackUrl: "/resources" })
      // No need to close modal here as the redirect will happen automatically
    } catch (err) {
      setErrors({ form: "Failed to sign in with Google. Please try again." })
      console.error("Google sign-in error:", err)
      setIsSubmitting(false)
    }
  }

  const modalConfig = createModalConfig(modalHeight);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={modalConfig.content.className}
        style={modalConfig.content.style}
      >
        <DialogHeader className={modalConfig.header.className}>
          <DialogTitle className={modalTitleStyles.default}>Log in to Ability Buddy</DialogTitle>
          <DialogDescription className={modalDescriptionStyles}>Access your account to share and manage resources.</DialogDescription>
        </DialogHeader>

        <div className={modalConfig.body.className}>
          <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#00796B]">
              Email
            </Label>
            <CustomInput
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`border-[#B39DDB] rounded-lg ${errors.email ? "border-red-500" : ""}`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-[#00796B]">
                Password
              </Label>
              <Button
                type="button"
                variant="link"
                className="text-[#4CAF50] p-0 h-auto text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot password?
              </Button>
            </div>
            <div className="relative">
              <CustomInput
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`border-[#B39DDB] rounded-lg pr-10 ${errors.password ? "border-red-500" : ""}`}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
              className="data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50] rounded-sm"
            />
            <Label htmlFor="remember" className="text-sm text-gray-600">
              Remember me for 30 days
            </Label>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 rounded-lg">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-[#B39DDB] text-[#00796B] rounded-lg flex items-center justify-center gap-2"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Sign in with Google
          </Button>

            <div className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Button type="button" variant="link" className="text-[#4CAF50] p-0 h-auto" onClick={onSwitchToRegister}>
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
        onBackToLogin={() => setShowForgotPassword(false)}
      />
    </Dialog>
  )
}
