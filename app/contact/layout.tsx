import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Feedback | Ability Buddy",
  description: "Get in touch with the Ability Buddy team. Share feedback, report issues, or suggest new features for our disability resource platform.",
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 