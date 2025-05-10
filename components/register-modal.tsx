"use client"

import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
})

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    if (!acceptTerms) {
      setErrors({ terms: "You must accept the terms and conditions to register" })
      setIsSubmitting(false)
      return
    }

    try {
      // Validate form data
      registerSchema.parse(formData)

      // Here you would typically send the data to your API
      console.log("Registration data:", { ...formData, acceptTerms })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Close modal on success
      onClose()
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-[#B39DDB]/30 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00796B]">Create an account</DialogTitle>
          <DialogDescription>Join Ability Buddy to share resources and help others.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          {errors.form && (
            <div className="bg-red-50 p-3 rounded-md flex items-start gap-2 text-red-700 text-sm">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#00796B]">
              Full Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              className={`border-[#B39DDB] ${errors.name ? "border-red-500" : ""}`}
              aria-invalid={errors.name ? "true" : "false"}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-[#00796B]">
              Email
            </Label>
            <Input
              id="register-email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              className={`border-[#B39DDB] ${errors.email ? "border-red-500" : ""}`}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "register-email-error" : undefined}
            />
            {errors.email && (
              <p id="register-email-error" className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-[#00796B]">
              Password
            </Label>
            <Input
              id="register-password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`border-[#B39DDB] ${errors.password ? "border-red-500" : ""}`}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby={errors.password ? "register-password-error" : undefined}
            />
            {errors.password && (
              <p id="register-password-error" className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Password must be at least 8 characters and include uppercase, lowercase, and numbers.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(checked) => {
                setAcceptTerms(checked === true)
                if (checked && errors.terms) {
                  setErrors((prev) => {
                    const newErrors = { ...prev }
                    delete newErrors.terms
                    return newErrors
                  })
                }
              }}
              className={`mt-1 data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50] ${
                errors.terms ? "border-red-500" : ""
              }`}
            />
            <div>
              <Label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#4CAF50] p-0 h-auto text-sm"
                  onClick={() => console.log("Terms clicked")}
                >
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button
                  type="button"
                  variant="link"
                  className="text-[#4CAF50] p-0 h-auto text-sm"
                  onClick={() => console.log("Privacy clicked")}
                >
                  Privacy Policy
                </Button>
              </Label>
              {errors.terms && <p className="text-red-500 text-sm mt-1">{errors.terms}</p>}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Button type="button" variant="link" className="text-[#4CAF50] p-0 h-auto" onClick={onSwitchToLogin}>
              Log in
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
