import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const InfoSection: FC = () => {
  return (
    <section className="mb-12 px-4">
      <div className="bg-[#1E1E22] rounded-xl p-6 md:p-8 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 mb-6">SocialSwap makes it easy to buy and sell established social media profiles with just a few simple steps.</p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-search-line text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">1. Browse & Find</h3>
                  <p className="text-gray-400 text-sm">Search through thousands of profiles across all major social media platforms.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-chat-check-line text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">2. Contact & Verify</h3>
                  <p className="text-gray-400 text-sm">Reach out to sellers and verify profiles with our secure escrow service.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-primary bg-opacity-10 rounded-lg flex items-center justify-center mr-4">
                  <i className="ri-exchange-line text-primary text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">3. Transfer & Pay</h3>
                  <p className="text-gray-400 text-sm">Complete secure payment and account transfer through our platform.</p>
                </div>
              </div>
            </div>
            
            <Link href="/how-it-works">
              <Button className="mt-8">Learn More</Button>
            </Link>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-lg h-[300px] md:h-auto">
              <svg 
                viewBox="0 0 600 500" 
                className="w-full h-full"
                style={{ background: "linear-gradient(135deg, #2D2D35 0%, #1A1A20 100%)" }}
              >
                <g>
                  <circle cx="300" cy="250" r="150" fill="#8B5CF6" fillOpacity="0.1"/>
                  <circle cx="300" cy="250" r="120" fill="#8B5CF6" fillOpacity="0.15"/>
                  <circle cx="300" cy="250" r="90" fill="#8B5CF6" fillOpacity="0.2"/>
                  <circle cx="235" cy="200" r="30" fill="#FC9CF3" fillOpacity="0.5"/>
                  <circle cx="365" cy="200" r="30" fill="#93C5FD" fillOpacity="0.5"/>
                  <circle cx="300" cy="320" r="30" fill="#A7F3D0" fillOpacity="0.5"/>
                  <path d="M235 200 L300 250 L365 200" stroke="#8B5CF6" strokeWidth="4" fill="none"/>
                  <path d="M300 250 L300 320" stroke="#8B5CF6" strokeWidth="4" fill="none"/>
                </g>
                <text x="50%" y="15%" textAnchor="middle" fill="white" fontWeight="bold" fontSize="24">
                  Secure Profile Transfer
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoSection;
