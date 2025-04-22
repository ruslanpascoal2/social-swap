import { FC } from "react";

interface SocialPlatformIconProps {
  platform: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SocialPlatformIcon: FC<SocialPlatformIconProps> = ({ 
  platform, 
  size = "md",
  className = ""
}) => {
  const getIconClass = () => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "ri-instagram-line text-pink-500";
      case "twitter":
        return "ri-twitter-x-line text-blue-400";
      case "tiktok":
        return "ri-tiktok-line text-white";
      case "youtube":
        return "ri-youtube-line text-red-500";
      case "facebook":
        return "ri-facebook-circle-line text-blue-500";
      case "linkedin":
        return "ri-linkedin-box-line text-blue-600";
      default:
        return "ri-global-line text-gray-400";
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "text-lg";
      case "md":
        return "text-xl";
      case "lg":
        return "text-2xl";
      case "xl":
        return "text-3xl";
      default:
        return "text-xl";
    }
  };

  return (
    <i className={`${getIconClass()} ${getSizeClass()} ${className}`}></i>
  );
};

export default SocialPlatformIcon;
