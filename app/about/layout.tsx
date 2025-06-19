import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Ability Buddy",
  description: "Learn about the story behind Ability Buddy - a passion project to help the disability community share resources and solutions.",
};

export default function AboutLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
} 