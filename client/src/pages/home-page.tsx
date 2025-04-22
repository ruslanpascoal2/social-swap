import { FC } from "react";
import HeroSection from "@/components/home/hero-section";
import FeaturedProfiles from "@/components/home/featured-profiles";
import MarketplaceSection from "@/components/home/marketplace-section";
import InfoSection from "@/components/home/info-section";
import TestimonialsSection from "@/components/home/testimonials-section";
import CTASection from "@/components/home/cta-section";

const HomePage: FC = () => {
  return (
    <div className="container mx-auto py-6">
      <HeroSection />
      <FeaturedProfiles />
      <MarketplaceSection />
      <InfoSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default HomePage;
