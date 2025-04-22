import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection: FC = () => {
  return (
    <section className="mb-12 container mx-auto px-4 md:px-6 py-12">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-10 md:p-16 text-center border border-gray-200 shadow-sm">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
          Join thousands of users who are buying and selling social media profiles on SocialSwap.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/#marketplace">
            <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 font-medium rounded-md w-full sm:w-auto">
              Browse Profiles
            </Button>
          </Link>
          <Link href="/create-listing">
            <Button variant="outline" size="lg" className="bg-white hover:bg-gray-50 text-gray-900 border-gray-300 px-8 py-3 font-medium rounded-md w-full sm:w-auto">
              Sell Your Profile
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
