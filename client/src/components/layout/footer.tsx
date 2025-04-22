import { Link } from "wouter";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#1E1E22] border-t border-gray-800 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <a className="flex items-center space-x-2 mb-4">
                <span className="text-primary text-2xl"><i className="ri-swap-line"></i></span>
                <span className="font-bold text-xl">SocialSwap</span>
              </a>
            </Link>
            <p className="text-gray-400 text-sm mb-4">The #1 marketplace for buying and selling social media profiles.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-twitter-x-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-facebook-circle-line text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <i className="ri-linkedin-box-line text-xl"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li><Link href="/"><a className="text-gray-400 hover:text-primary text-sm">Browse Profiles</a></Link></li>
              <li><Link href="/create-listing"><a className="text-gray-400 hover:text-primary text-sm">Sell Your Profile</a></Link></li>
              <li><Link href="/"><a className="text-gray-400 hover:text-primary text-sm">Featured Profiles</a></Link></li>
              <li><Link href="/pricing"><a className="text-gray-400 hover:text-primary text-sm">Pricing</a></Link></li>
              <li><Link href="/success-stories"><a className="text-gray-400 hover:text-primary text-sm">Success Stories</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/how-it-works"><a className="text-gray-400 hover:text-primary text-sm">How It Works</a></Link></li>
              <li><Link href="/faq"><a className="text-gray-400 hover:text-primary text-sm">FAQ</a></Link></li>
              <li><Link href="/security"><a className="text-gray-400 hover:text-primary text-sm">Security</a></Link></li>
              <li><Link href="/blog"><a className="text-gray-400 hover:text-primary text-sm">Blog</a></Link></li>
              <li><Link href="/support"><a className="text-gray-400 hover:text-primary text-sm">Support</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-gray-400 hover:text-primary text-sm">About Us</a></Link></li>
              <li><Link href="/careers"><a className="text-gray-400 hover:text-primary text-sm">Careers</a></Link></li>
              <li><Link href="/press"><a className="text-gray-400 hover:text-primary text-sm">Press</a></Link></li>
              <li><Link href="/contact"><a className="text-gray-400 hover:text-primary text-sm">Contact</a></Link></li>
              <li><Link href="/partnerships"><a className="text-gray-400 hover:text-primary text-sm">Partnerships</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {currentYear} SocialSwap. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/terms"><a className="text-gray-400 hover:text-primary text-sm">Terms</a></Link>
            <Link href="/privacy"><a className="text-gray-400 hover:text-primary text-sm">Privacy</a></Link>
            <Link href="/cookies"><a className="text-gray-400 hover:text-primary text-sm">Cookies</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
