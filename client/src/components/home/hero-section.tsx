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
    <section className="relative py-20 mb-12 animate-in fade-in duration-500">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Creators, welcome home.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              SocialSwap is a toolkit made by influencers, for influencers, that puts the focus on you and your brand.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/#marketplace">
                <Button size="lg" className="w-full sm:w-auto px-6 py-3 font-medium rounded-md bg-black hover:bg-gray-800 text-white">
                  Browse Profiles
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3 font-medium rounded-md border border-gray-300 hover:bg-gray-100">
                  Sell Your Profile
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 text-sm text-gray-500">
              Requires account registration or login to trade profiles.
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="w-full h-[400px] bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl overflow-hidden shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-3/4 h-3/4 text-gray-900 opacity-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C14.5013 2 15.5281 2 16.2682 2.27248C18.5418 3.00229 20.0884 4.67168 20.7325 6.87621C21 7.59495 21 8.62345 21 10.0144L21 14C21 16.8003 21 18.2004 20.455 19.27C19.9757 20.2108 19.2092 20.9757 18.2682 21.455C17.1986 22 15.7986 22 13 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M11 22C8.20139 22 6.80209 22 5.73251 21.455C4.79148 20.9757 4.02503 20.2108 3.54558 19.27C3 18.2004 3 16.8003 3 14L3 10.0144C3 8.62345 3 7.59495 3.26748 6.87621C3.91156 4.67168 5.45816 3.00229 7.73177 2.27248C8.47188 2 9.49868 2 11.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 15.5C14.4853 15.5 16.5 13.4853 16.5 11C16.5 8.51472 14.4853 6.5 12 6.5C9.51472 6.5 7.5 8.51472 7.5 11C7.5 13.4853 9.51472 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Filter by Platform</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
      </div>
    </section>
  );
};

export default HeroSection;
