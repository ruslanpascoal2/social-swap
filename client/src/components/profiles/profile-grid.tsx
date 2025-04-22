import { FC } from "react";
import { Profile } from "@shared/schema";
import ProfileCard from "./profile-card";
import { Skeleton } from "@/components/ui/skeleton";

interface ProfileGridProps {
  profiles: Profile[];
  isLoading: boolean;
  compact?: boolean;
}

const ProfileGrid: FC<ProfileGridProps> = ({ profiles, isLoading, compact = false }) => {
  if (isLoading) {
    return (
      <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
        {Array(compact ? 8 : 3).fill(0).map((_, i) => (
          <Skeleton key={i} className={`rounded-xl ${compact ? 'h-[280px]' : 'h-[400px]'}`} />
        ))}
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="text-center py-12 bg-[#1E1E22] rounded-xl border border-gray-800">
        <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
        <p className="text-gray-400">There are no profiles available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 ${compact ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
      {profiles.map(profile => (
        <ProfileCard key={profile.id} profile={profile} compact={compact} />
      ))}
    </div>
  );
};

export default ProfileGrid;
