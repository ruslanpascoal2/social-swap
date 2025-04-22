import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import PlatformFilter from "@/components/profiles/platform-filter";
import { useQuery } from "@tanstack/react-query";
import { Platform } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection: FC = () => {
  const { data: platforms, isLoading } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  return (
    <section className="relative mb-12 px-4 animate-in fade-in duration-500">
      <div className="bg-gradient-to-r from-[#1E1E22] to-[#121214] p-6 md:p-12 rounded-xl border border-gray-800">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Buy and Sell Social Media Profiles</h1>
          <p className="text-gray-400 text-lg mb-6">The #1 marketplace for established social media accounts across all major platforms.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/#marketplace">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Profiles
              </Button>
            </Link>
            <Link href="/create-listing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-[#1E1E22] border-gray-700 hover:bg-[#2A2A30]">
                Sell Your Profile
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-20 hidden lg:block">
          <i className="ri-instagram-line text-[180px] text-primary"></i>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-8 mb-4">
        <h2 className="text-xl font-semibold">Filter by Platform</h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
        {isLoading ? (
          // Loading skeletons
          Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))
        ) : (
          platforms?.map((platform) => (
            <PlatformFilter 
              key={platform.id} 
              name={platform.name} 
              iconClass={platform.iconClass} 
              iconColor={platform.iconColor}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default HeroSection;
