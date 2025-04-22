import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { Search, Store, Heart, Info, Bell, LogOut, User, Plus } from "lucide-react";

const Navbar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <header className="bg-[#1E1E22] border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <span className="text-primary text-2xl"><i className="ri-swap-line"></i></span>
                <span className="font-bold text-xl">SocialSwap</span>
              </a>
            </Link>
            
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link href="/">
                <a className={`flex items-center text-sm font-medium ${location === "/" ? "text-white" : "text-gray-400 hover:text-white"}`}>
                  <Store className="mr-1.5 h-4 w-4" /> Marketplace
                </a>
              </Link>
              <Link href="/watchlist">
                <a className={`flex items-center text-sm font-medium ${location === "/watchlist" ? "text-white" : "text-gray-400 hover:text-white"}`}>
                  <Heart className="mr-1.5 h-4 w-4" /> Watchlist
                </a>
              </Link>
              <Link href="/how-it-works">
                <a className={`flex items-center text-sm font-medium ${location === "/how-it-works" ? "text-white" : "text-gray-400 hover:text-white"}`}>
                  <Info className="mr-1.5 h-4 w-4" /> How It Works
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Input
                type="text"
                placeholder="Search profiles..."
                className="w-64 bg-[#121214] border border-gray-700 rounded-full py-2 pl-10 text-sm focus:border-primary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
            
            {user ? (
              <>
                <Link href="/create-listing">
                  <Button className="hidden md:flex items-center">
                    <Plus className="mr-1.5 h-4 w-4" /> List Profile
                  </Button>
                </Link>
                
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Bell className="h-5 w-5 text-gray-400" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                      <Avatar className="h-9 w-9 bg-primary">
                        <AvatarFallback>{getInitials(user.fullName || user.username)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1E1E22] border-gray-800">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-sm text-white">{user.fullName || user.username}</p>
                        <p className="w-[200px] truncate text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Store className="mr-2 h-4 w-4" />
                      <span>My Listings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Watchlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/auth">
                <Button>Sign in</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
