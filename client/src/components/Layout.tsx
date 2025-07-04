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
  Bell
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
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const currentPage = navigation.find(item => item.href === location)?.name || "Dashboard";

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="flex items-center justify-center h-16 border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">SaaS Manager</h1>
        </div>
        <nav className="mt-8">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a className={`sidebar-nav-item ${isActive ? 'active' : ''}`}>
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </a>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <h2 className="text-2xl font-semibold text-slate-800">{currentPage}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-slate-700">John Doe</span>
              </div>
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
