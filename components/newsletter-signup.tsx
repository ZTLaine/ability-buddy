"use client"

import type React from "react"

import { useState } from "react"
import { AppButton } from "@/components/ui/app-button"
import { CustomInput } from "@/components/ui/custom-input"
import { z } from "zod"

const emailSchema = z.string().email("Please enter a valid email address")

export function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      emailSchema.parse(email)
      // Here you would typically send the email to your API
      console.log("Subscribing email:", email)
      setSuccess(true)
      setEmail("")
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError("An error occurred. Please try again.")
      }
    }
  }

  if (success) {
    return (
      <div className="bg-[#4CAF50]/10 p-4 rounded-lg text-[#00796B]">
        <p className="font-medium">Thank you for subscribing!</p>
        <p className="text-sm mt-1">We'll send you updates about new resources.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="flex gap-2">
          <CustomInput
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            className="bg-white border-[#B39DDB] focus:border-[#4CAF50] rounded-lg"
            aria-label="Email address for newsletter"
            aria-describedby={error ? "email-error" : undefined}
          />
          <AppButton
            appVariant="primary"
            type="submit"
            className="rounded-lg"
          >
            Subscribe
          </AppButton>
        </div>
        {error && (
          <p id="email-error" className="text-red-500 text-sm mt-1">
            {error}
          </p>
        )}
      </div>
      <p className="text-sm text-[#00796B]/80">We respect your privacy. Unsubscribe at any time.</p>
    </form>
  )
}
