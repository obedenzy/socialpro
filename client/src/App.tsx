import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Reviews from "@/components/Reviews";
import SocialMedia from "@/components/SocialMedia";
import ChatBot from "@/components/ChatBot";
import Calendar from "@/components/Calendar";
import PostCards from "@/components/PostCards";
import Promotions from "@/components/Promotions";
import Email from "@/components/Email";
import Users from "@/components/Users";
import Payments from "@/components/Payments";
import UserProfile from "@/components/UserProfile";
import Notifications from "@/components/Notifications";
import OutboundCommunications from "@/components/OutboundCommunications";
import PromoLandingPage from "@/components/PromoLandingPage";
import ReviewLandingPage from "@/components/ReviewLandingPage";
import { initializeMockData } from "@/lib/mockData";
import { useEffect } from "react";

function Router() {
  return (
    <Switch>
      {/* Public landing pages - no layout */}
      <Route path="/promo/:userId/:promoId" component={PromoLandingPage} />
      <Route path="/review/:userId/:reviewId" component={ReviewLandingPage} />
      
      {/* Main app routes with layout */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/reviews" component={Reviews} />
            <Route path="/social" component={SocialMedia} />
            <Route path="/chatbot" component={ChatBot} />
            <Route path="/calendar" component={Calendar} />
            <Route path="/posts" component={PostCards} />
            <Route path="/promotions" component={Promotions} />
            <Route path="/email" component={Email} />
            <Route path="/users" component={Users} />
            <Route path="/payments" component={Payments} />
            <Route path="/profile" component={UserProfile} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/outbound" component={OutboundCommunications} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
