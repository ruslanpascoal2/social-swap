import { FC } from "react";

const testimonials = [
  {
    text: "I was able to sell my fashion Instagram account quickly and for a great price. The process was smooth and secure.",
    author: "Ana M.",
    role: "Sold Instagram Account",
    initials: "AM",
    color: "bg-primary"
  },
  {
    text: "Purchased a tech Twitter account for my startup. Saved us months of building an audience from scratch. Worth every penny!",
    author: "James T.",
    role: "Bought Twitter Account",
    initials: "JT",
    color: "bg-blue-500"
  },
  {
    text: "SocialSwap's escrow service gave me peace of mind when buying a YouTube channel. Customer support was excellent.",
    author: "Sarah L.",
    role: "Bought YouTube Channel",
    initials: "SL",
    color: "bg-green-500"
  }
];

const TestimonialsSection: FC = () => {
  return (
    <section className="mb-12 px-4">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold mb-2">What Our Users Say</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Our marketplace has helped thousands of users buy and sell social media profiles with ease and security.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-[#1E1E22] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">
                {Array(5).fill(0).map((_, i) => (
                  <i key={i} className="ri-star-fill"></i>
                ))}
              </div>
            </div>
            
            <blockquote className="mb-6">
              <p className="text-gray-400 italic">"{testimonial.text}"</p>
            </blockquote>
            
            <div className="flex items-center">
              <div className={`w-10 h-10 ${testimonial.color} rounded-full flex items-center justify-center mr-3`}>
                <span className="text-white font-medium text-sm">{testimonial.initials}</span>
              </div>
              <div>
                <h4 className="font-medium">{testimonial.author}</h4>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
