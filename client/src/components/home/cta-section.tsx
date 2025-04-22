import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection: FC = () => {
  return (
    <section className="mb-12 px-4">
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 rounded-xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of users who are buying and selling social media profiles on SocialSwap.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/#marketplace">
            <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
              Browse Profiles
            </Button>
          </Link>
          <Link href="/create-listing">
            <Button variant="outline" size="lg" className="bg-primary-800 bg-opacity-50 hover:bg-opacity-70 text-white border border-white border-opacity-20 w-full sm:w-auto">
              Sell Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
