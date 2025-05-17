"use client"

import type React from "react"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/ui/custom-input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Icons } from "@/components/icons"
import { RegisterSchema, type RegisterFormData } from "@/lib/schemas/auth"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const router = useRouter()
  const { register, handleSubmit: handleFormSubmit, formState: { errors, touchedFields, isSubmitting }, control, setValue, trigger } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Failed to register. Please try again.");
      } else {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });

        if (signInResult?.ok) {
          onClose();
          router.push("/resources");
          router.refresh();
        } else {
          alert(signInResult?.error || "Registration successful, but failed to sign in.");
        }
      }
    } catch (err) {
      console.error("Unexpected registration error:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/resources" })
    } catch (err) {
      console.error("Google sign-in error:", err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border border-[#B39DDB]/30 shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#00796B]">Create an account</DialogTitle>
          <DialogDescription>Join Ability Buddy to share resources and help others.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#00796B]">
              Display Name <span className="text-xs text-gray-500">(optional)</span>
            </Label>
            <CustomInput
              id="name"
              {...register("name")}
              type="text"
              placeholder="Your display name"
              className={`border-[#B39DDB] rounded-lg ${errors.name ? "border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-[#00796B]">
              Email
            </Label>
            <CustomInput
              id="register-email"
              {...register("email")}
              type="email"
              placeholder="your.email@example.com"
              className={`border-[#B39DDB] rounded-lg ${errors.email ? "border-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-[#00796B]">
              Password
            </Label>
            <div className="relative">
              <CustomInput
                id="register-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`border-[#B39DDB] rounded-lg pr-10 ${errors.password ? "border-red-500" : ""}`}
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
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[#00796B]">
              Confirm Password
            </Label>
            <div className="relative">
              <CustomInput
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword")}
                className={`border-[#B39DDB] rounded-lg pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirmPassword ? <Icons.eyeOff className="h-4 w-4" /> : <Icons.eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white rounded-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Icons.spinner className="animate-spin mr-2 h-4 w-4"/> : "Create account"}
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
            Sign up with Google
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
