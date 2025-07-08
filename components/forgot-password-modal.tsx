"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react"
import { Icons } from "@/components/icons"
import { useModalHeight } from "@/hooks/use-modal-height"
import { createModalConfig, modalTitleStyles, modalDescriptionStyles } from "@/lib/modal-config"

// Extract icon component with proper PascalCase name
const { spinner: SpinnerIcon } = Icons

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

interface ForgotPasswordModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onBackToLogin: () => void
}

export function ForgotPasswordModal({ isOpen, onClose, onBackToLogin }: Readonly<ForgotPasswordModalProps>) {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const modalHeight = useModalHeight({ isOpen, dependencies: [errors, isSuccess] })

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
      const validatedData = forgotPasswordSchema.parse(formData)

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (!response.ok) {
        setErrors({ form: result.message ?? "Failed to send reset email. Please try again." })
      } else {
        setIsSuccess(true)
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
      setFormData({ email: "" });
      setErrors({});
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleBackToLogin = () => {
    setIsSuccess(false)
    setFormData({ email: "" })
    setErrors({})
    onBackToLogin()
  }

  const modalConfig = createModalConfig(modalHeight);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={modalConfig.content.className}
        style={modalConfig.content.style}
      >
        <DialogHeader className={modalConfig.header.className}>
          <div className="flex items-center gap-2 mb-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#00796B] hover:bg-[#00796B]/10"
              onClick={handleBackToLogin}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <DialogTitle className={modalTitleStyles.default}>
              {isSuccess ? "Check your email" : "Reset your password"}
            </DialogTitle>
          </div>
          <DialogDescription className={modalDescriptionStyles}>
            {isSuccess 
              ? "If an account with that email exists, we sent you a password reset link."
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </DialogDescription>
        </DialogHeader>

        <div className={modalConfig.body.className}>
          {isSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3 text-green-700">
                <CheckCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reset link sent!</p>
                  <p className="text-sm mt-1">
                    Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button
                  type="button"
                  className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg"
                  onClick={handleBackToLogin}
                >
                  Back to login
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#B39DDB] text-[#00796B] rounded-lg"
                  onClick={() => {
                    setIsSuccess(false)
                    setFormData({ email: "" })
                    setErrors({})
                  }}
                >
                  Send another email
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.form && (
                <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{errors.form}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="forgot-email" className="text-[#00796B]">
                  Email
                </Label>
                <CustomInput
                  id="forgot-email"
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

              <Button
                type="submit"
                className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <SpinnerIcon className="animate-spin mr-2 h-4 w-4" />
                    Sending reset link...
                  </>
                ) : (
                  "Send reset link"
                )}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Remember your password?{" "}
                <Button 
                  type="button" 
                  variant="link" 
                  className="text-[#4CAF50] p-0 h-auto" 
                  onClick={handleBackToLogin}
                >
                  Back to login
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 