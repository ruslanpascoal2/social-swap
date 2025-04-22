import { FC } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import ProfileCard from "@/components/profiles/profile-card";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProfiles: FC = () => {
  const { data: featuredProfiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles/featured"],
  });

  return (
    <section className="mb-12 container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">Featured Profiles</h2>
        <Link href="/#marketplace">
          <span className="text-gray-900 hover:text-gray-600 text-sm font-medium flex items-center">
            View All <i className="ri-arrow-right-line ml-1"></i>
          </span>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-[400px] rounded-xl" />
          ))
        ) : featuredProfiles && featuredProfiles.length > 0 ? (
          featuredProfiles.slice(0, 3).map((profile) => (
            <ProfileCard 
              key={profile.id} 
              profile={profile} 
              featured={true}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
            <p className="text-gray-500">No featured profiles available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProfiles;
