import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Profile } from "@shared/schema";
import ProfileGrid from "@/components/profiles/profile-grid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";

const MarketplaceSection: FC = () => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: profiles, isLoading } = useQuery<Profile[]>({
    queryKey: ["/api/profiles"],
  });

  const sortProfiles = (profiles: Profile[] | undefined) => {
    if (!profiles) return [];
    
    const sortedProfiles = [...profiles];
    
    switch (sortOrder) {
      case "newest":
        return sortedProfiles.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "price-low":
        return sortedProfiles.sort((a, b) => a.price - b.price);
      case "price-high":
        return sortedProfiles.sort((a, b) => b.price - a.price);
      case "followers-high":
        return sortedProfiles.sort((a, b) => b.followers - a.followers);
      case "engagement-high":
        return sortedProfiles.sort((a, b) => b.engagement - a.engagement);
      default:
        return sortedProfiles;
    }
  };

  const sortedProfiles = sortProfiles(profiles);
  const totalPages = Math.ceil((sortedProfiles?.length || 0) / itemsPerPage);
  
  const paginatedProfiles = sortedProfiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    return (
      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-10 h-10 rounded-lg bg-[#1E1E22] border-gray-700"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }
            
            return (
              <Button 
                key={i}
                variant={currentPage === pageNum ? "default" : "outline"}
                className={`w-10 h-10 ${currentPage !== pageNum && "bg-[#1E1E22] border-gray-700"}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          
          {totalPages > 5 && currentPage < totalPages - 2 && (
            <>
              <span className="w-10 h-10 flex items-center justify-center">...</span>
              <Button 
                variant="outline"
                className="w-10 h-10 bg-[#1E1E22] border-gray-700"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </Button>
            </>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-10 h-10 rounded-lg bg-[#1E1E22] border-gray-700"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    );
  };

  return (
    <section className="mb-12 px-4" id="marketplace">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Browse All Profiles</h2>
        <div className="flex space-x-2">
          <div className="relative hidden md:block">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="bg-[#1E1E22] border-gray-700 rounded-lg py-2 px-4 text-sm w-44">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E22] border-gray-700">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="followers-high">Most Followers</SelectItem>
                <SelectItem value="engagement-high">Highest Engagement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" size="icon" className="bg-[#1E1E22] border-gray-700">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ProfileGrid profiles={paginatedProfiles} isLoading={isLoading} compact />
      
      {renderPagination()}
    </section>
  );
};

export default MarketplaceSection;
