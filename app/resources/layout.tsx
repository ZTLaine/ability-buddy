import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Ability Buddy",
  description: "Discover resources to help with various disabilities and conditions.",
};

export default function ResourcesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 