import { FC, useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Profile, Platform, Category, Watchlist } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import SocialPlatformIcon from "@/components/ui/social-platform-icon";

interface ProfileCardProps {
  profile: Profile;
  featured?: boolean;
  compact?: boolean;
}

const ProfileCard: FC<ProfileCardProps> = ({ profile, featured = false, compact = false }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  // Fetch platform and category data
  const { data: platform } = useQuery<Platform>({
    queryKey: ["/api/platforms", profile.platformId],
    enabled: !!profile.platformId,
  });
  
  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", profile.categoryId],
    enabled: !!profile.categoryId,
  });
  
  // Fetch watchlist status
  const { data: watchlist } = useQuery<Watchlist[]>({
    queryKey: ["/api/watchlist"],
    enabled: !!user,
  });
  
  const isInWatchlist = watchlist?.some(item => item.profileId === profile.id);
  
  // Add/remove from watchlist
  const addToWatchlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/watchlist", { profileId: profile.id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Added to watchlist",
        description: "Profile has been added to your watchlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Could not add to watchlist",
        variant: "destructive",
      });
    },
  });
  
  const removeFromWatchlistMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/watchlist/${profile.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Removed from watchlist",
        description: "Profile has been removed from your watchlist",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Could not remove from watchlist",
        variant: "destructive",
      });
    },
  });
  
  const toggleWatchlist = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add profiles to your watchlist",
        variant: "destructive",
      });
      return;
    }
    
    if (isInWatchlist) {
      removeFromWatchlistMutation.mutate();
    } else {
      addToWatchlistMutation.mutate();
    }
  };
  
  // Format price
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // Format followers count
  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (compact) {
    return (
      <article 
        className={`bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 ${isHovered ? 'transform -translate-y-1 shadow-md' : 'shadow-sm'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="w-full h-32 bg-gradient-to-r from-purple-100 to-blue-50"></div>
          {platform && (
            <div className="absolute top-2 right-2 bg-white shadow-sm rounded-full px-2 py-1 flex items-center">
              <SocialPlatformIcon platform={platform.name} size="sm" className="mr-1" />
              <span className="text-xs font-medium text-gray-800">{platform.name}</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-base mb-1 text-gray-900">{profile.title}</h3>
          <div className="flex items-center text-gray-500 text-xs mb-3">
            <span className="flex items-center mr-3">
              <i className="ri-user-line mr-1"></i> {formatFollowers(profile.followers)}
            </span>
            <span className="flex items-center">
              <i className="ri-heart-line mr-1"></i> {profile.engagement.toFixed(1)}% Eng.
            </span>
          </div>
          
          <div className="flex justify-between mb-4">
            <span className="text-gray-500 text-xs">Category: {category?.name || "Unknown"}</span>
            <span className="text-gray-900 font-semibold">{formatPrice(profile.price)}</span>
          </div>
          
          <Link href={`/profile/${profile.id}`}>
            <Button variant="outline" className="w-full bg-white border-gray-200 hover:bg-gray-50 text-gray-900">
              View Details
            </Button>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article 
      className={`bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300 ${isHovered ? 'transform -translate-y-1 shadow-md' : 'shadow-sm'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="w-full h-40 bg-gradient-to-r from-purple-100 to-blue-50"></div>
        {platform && (
          <div className="absolute top-3 right-3 bg-white shadow-sm rounded-full px-3 py-1 flex items-center">
            <SocialPlatformIcon platform={platform.name} className="mr-1" />
            <span className="text-xs font-medium text-gray-800">{platform.name}</span>
          </div>
        )}
        {featured && (
          <div className="absolute top-3 left-3 bg-black rounded-full px-3 py-1">
            <span className="text-xs font-medium text-white">Featured</span>
          </div>
        )}
        {profile.isHot && (
          <div className="absolute top-3 left-3 bg-red-500 rounded-full px-3 py-1">
            <span className="text-xs font-medium text-white">Hot</span>
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg mb-1 text-gray-900">{profile.title}</h3>
            <div className="flex items-center text-gray-500 text-sm">
              <span className="flex items-center mr-3">
                <i className="ri-user-line mr-1"></i> {formatFollowers(profile.followers)}
              </span>
              <span className="flex items-center">
                <i className="ri-heart-line mr-1"></i> {profile.engagement.toFixed(1)}% Engagement
              </span>
            </div>
          </div>
          <span className="text-xl font-semibold text-gray-900">{formatPrice(profile.price)}</span>
        </div>
        
        <div className="space-y-3 mb-5">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Category</span>
            <span className="font-medium text-gray-900">{category?.name || "Unknown"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Age</span>
            <span className="font-medium text-gray-900">{profile.age}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Weekly posts</span>
            <span className="font-medium text-gray-900">{profile.weeklyPosts}</span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Link href={`/profile/${profile.id}`} className="flex-1">
            <Button className="w-full bg-black hover:bg-gray-800 text-white">View Details</Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            className={`flex items-center justify-center w-10 h-10 rounded-md border ${isInWatchlist ? 'border-black text-black' : 'border-gray-200 hover:border-gray-400'}`}
            onClick={toggleWatchlist}
          >
            <Heart className={`h-5 w-5 ${isInWatchlist ? 'fill-black' : ''}`} />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
