import { FC } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const InfoSection: FC = () => {
  return (
    <section className="mb-12 container mx-auto px-4 md:px-6 py-16">
      <div className="bg-white rounded-xl p-8 md:p-10 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">How It Works</h2>
            <p className="text-gray-600 mb-8">SocialSwap makes it easy to buy and sell established social media profiles with just a few simple steps.</p>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mr-5">
                  <i className="ri-search-line text-gray-900 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">1. Browse & Find</h3>
                  <p className="text-gray-600">Search through thousands of profiles across all major social media platforms.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mr-5">
                  <i className="ri-chat-check-line text-gray-900 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">2. Contact & Verify</h3>
                  <p className="text-gray-600">Reach out to sellers and verify profiles with our secure escrow service.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mr-5">
                  <i className="ri-exchange-line text-gray-900 text-xl"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">3. Transfer & Pay</h3>
                  <p className="text-gray-600">Complete secure payment and account transfer through our platform.</p>
                </div>
              </div>
            </div>
            
            <Link href="/how-it-works">
              <Button className="mt-10 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-md">Learn More</Button>
            </Link>
          </div>
          
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-xl shadow-md h-[300px] md:h-auto bg-gradient-to-br from-purple-50 to-blue-50">
              <svg 
                viewBox="0 0 600 500" 
                className="w-full h-full"
              >
                <g>
                  <circle cx="300" cy="250" r="150" fill="#F3F4F6" fillOpacity="0.7"/>
                  <circle cx="300" cy="250" r="120" fill="#E5E7EB" fillOpacity="0.7"/>
                  <circle cx="300" cy="250" r="90" fill="#D1D5DB" fillOpacity="0.7"/>
                  <circle cx="235" cy="200" r="30" fill="#C084FC" fillOpacity="0.3"/>
                  <circle cx="365" cy="200" r="30" fill="#93C5FD" fillOpacity="0.3"/>
                  <circle cx="300" cy="320" r="30" fill="#6EE7B7" fillOpacity="0.3"/>
                  <path d="M235 200 L300 250 L365 200" stroke="#111827" strokeWidth="3" fill="none"/>
                  <path d="M300 250 L300 320" stroke="#111827" strokeWidth="3" fill="none"/>
                </g>
                <text x="50%" y="15%" textAnchor="middle" fill="#111827" fontWeight="bold" fontSize="24">
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
