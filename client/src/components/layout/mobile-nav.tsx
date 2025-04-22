import { useLocation, Link } from "wouter";

const MobileNav = () => {
  const [location] = useLocation();
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E1E22] border-t border-gray-800 py-2 px-4 z-50">
      <div className="flex justify-between items-center">
        <Link href="/">
          <a className={`flex flex-col items-center ${location === "/" ? "text-primary" : "text-gray-400"}`}>
            <i className="ri-store-2-line text-xl"></i>
            <span className="text-xs mt-1">Marketplace</span>
          </a>
        </Link>
        <Link href="/search">
          <a className={`flex flex-col items-center ${location === "/search" ? "text-primary" : "text-gray-400"}`}>
            <i className="ri-search-line text-xl"></i>
            <span className="text-xs mt-1">Search</span>
          </a>
        </Link>
        <Link href="/watchlist">
          <a className={`flex flex-col items-center ${location === "/watchlist" ? "text-primary" : "text-gray-400"}`}>
            <i className="ri-heart-line text-xl"></i>
            <span className="text-xs mt-1">Watchlist</span>
          </a>
        </Link>
        <Link href="/account">
          <a className={`flex flex-col items-center ${location.startsWith("/account") ? "text-primary" : "text-gray-400"}`}>
            <i className="ri-user-line text-xl"></i>
            <span className="text-xs mt-1">Account</span>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
