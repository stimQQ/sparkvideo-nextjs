import Navbar from '@/app/components/layout/navbar';
import Footer from '@/app/components/layout/footer';
import HeroSection from '@/app/components/home/hero-section';
import FeaturesSection from '@/app/components/home/features-section';
import PricingSection from '@/app/components/home/pricing-section';
import CTASection from '@/app/components/home/cta-section';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}