import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfileDetails from "@/pages/profile-details";
import CreateListing from "@/pages/create-listing";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import MobileNav from "@/components/layout/mobile-nav";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/profile/:id" component={ProfileDetails} />
      <ProtectedRoute path="/create-listing" component={CreateListing} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen bg-[#121214] text-white">
            <Navbar />
            <main className="flex-grow">
              <Router />
            </main>
            <Footer />
            <MobileNav />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
