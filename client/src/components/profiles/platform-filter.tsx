import { FC, useState } from "react";

interface PlatformFilterProps {
  name: string;
  iconClass: string;
  iconColor: string;
}

const PlatformFilter: FC<PlatformFilterProps> = ({ name, iconClass, iconColor }) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <button 
      className={`platform-filter flex flex-col items-center justify-center p-4 bg-[#1E1E22] rounded-lg border ${isActive ? 'border-primary' : 'border-gray-800 hover:border-primary'} transition-colors`}
      onClick={() => setIsActive(!isActive)}
    >
      <i className={`${iconClass} platform-icon text-3xl ${iconColor} mb-2 transition-all duration-200`}></i>
      <span className="text-sm font-medium">{name}</span>
    </button>
  );
};

export default PlatformFilter;
