"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  LoginSchema,
  RegisterSchema,
  LoginFormData,
  RegisterFormData,
} from "@/lib/schemas/auth";
import { Icons } from "@/components/icons"; 

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  initialView?: "login" | "register";
}

export function AuthModal({
  isOpen,
  onOpenChange,
  initialView = "login",
}: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<"login" | "register">(initialView);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google sign-in error:", err);
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password."
          : result.error
      );
    } else if (result?.ok) {
      onOpenChange(false);
      router.push("/");
      router.refresh();
    }
    setIsLoading(false);
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || "Failed to register. Please try again.");
      } else {
        const signInResult = await signIn("credentials", {
          redirect: false,
          email: data.email,
          password: data.password,
        });
        if (signInResult?.ok) {
          onOpenChange(false);
          router.push("/");
          router.refresh();
        } else {
          setError(
            signInResult?.error ||
              "Registration successful, but failed to sign in."
          );
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", err);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-cream-default rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-dark-teal">
            {view === "login" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription>
            {view === "login"
              ? "Access your account or sign in with Google."
              : "Join us or create an account with Google."}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {view === "login" ? (
          <Form {...loginForm}>
            <form
              onSubmit={loginForm.handleSubmit(onLoginSubmit)}
              className="space-y-4"
            >
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-teal">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-teal">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-bright-green hover:bg-green-600 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registerForm}>
            <form
              onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
              className="space-y-4"
            >
              <FormField
                control={registerForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-teal">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={registerForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-dark-teal">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Create a strong password"
                        {...field}
                        disabled={isLoading}
                        className="rounded-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-bright-green hover:bg-green-600 text-white rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-cream-default px-2 text-gray-500 rounded-lg">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-dark-teal text-dark-teal hover:bg-sky-blue/10 rounded-lg"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading && view === "login" ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}
          Google
        </Button>

        <p className="mt-4 text-center text-sm text-gray-600">
          {view === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => {
                  setView("register");
                  setError(null);
                  loginForm.reset();
                  registerForm.reset();
                }}
                className="font-medium text-bright-green hover:underline rounded-lg"
                disabled={isLoading}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => {
                  setView("login");
                  setError(null);
                  loginForm.reset();
                  registerForm.reset();
                }}
                className="font-medium text-bright-green hover:underline rounded-lg"
                disabled={isLoading}
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
