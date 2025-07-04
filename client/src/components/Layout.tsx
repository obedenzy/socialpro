import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Star, 
  Share2, 
  Bot, 
  Calendar,
  FileText,
  Percent,
  Mail,
  Users,
  CreditCard,
  Bell,
  User
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Reviews", href: "/reviews", icon: Star },
  { name: "Social Media", href: "/social", icon: Share2 },
  { name: "Chat Bot", href: "/chatbot", icon: Bot },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Post Cards", href: "/posts", icon: FileText },
  { name: "Promotions", href: "/promotions", icon: Percent },
  { name: "Email", href: "/email", icon: Mail },
  { name: "Users", href: "/users", icon: Users },
  { name: "Payments", href: "/payments", icon: CreditCard },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const currentPage = navigation.find(item => item.href === location)?.name || "Dashboard";
  const unreadNotifications = 5; // Mock unread count

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-sidebar-background shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">VELZON</h1>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <div className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-card shadow-sm border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-foreground">{currentPage}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
              </Link>
              <Link href="/profile">
                <div className="flex items-center space-x-2 cursor-pointer hover:bg-accent rounded-lg p-2 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b1a1?w=32&h=32&fit=crop&crop=face" />
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground">Anna Adame</span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
