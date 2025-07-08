'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { FeaturedResourcesSection } from "@/components/landing/featured-resources-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";
import ResetPasswordForm from '@/components/reset-password-form';

function LandingPageContent() {
  const [resetToken, setResetToken] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('resetToken');
    if (token) {
      setResetToken(token);
      setShowResetForm(true);
      // Clean up the URL by removing the resetToken parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('resetToken');
      window.history.replaceState({}, '', newUrl.toString());
    }
  }, [searchParams]);

  const handleCloseResetForm = () => {
    setShowResetForm(false);
    setResetToken('');
  };

  return (
    <div className="min-h-screen bg-[#FFFDE7]">
      <SiteHeader />
      
      {resetToken && showResetForm ? (
        // Show ONLY the reset form when reset token is present
        <main className="flex-1 flex items-center justify-center py-12">
          <ResetPasswordForm
            token={resetToken}
            onClose={handleCloseResetForm}
          />
        </main>
      ) : (
        // Show normal landing page content
        <>
          <main>
            <HeroSection />
            <BenefitsSection />
            <FeaturedResourcesSection />
            <CTASection />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}

export default function LandingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFDE7]" />}>
      <LandingPageContent />
    </Suspense>
  );
} 