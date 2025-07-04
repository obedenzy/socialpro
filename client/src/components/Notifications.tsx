import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Check, 
  X, 
  Settings, 
  Filter,
  MessageSquare,
  Star,
  Users,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info,
  XCircle
} from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: string;
  avatar?: string;
  actions?: Array<{
    label: string;
    action: string;
    variant?: "default" | "outline" | "destructive";
  }>;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "New Review Received",
      message: "Sarah Johnson left a 5-star review for your product",
      time: "2 minutes ago",
      read: false,
      category: "reviews",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1a1?w=32&h=32&fit=crop&crop=face",
      actions: [
        { label: "Reply", action: "reply", variant: "default" },
        { label: "View", action: "view", variant: "outline" }
      ]
    },
    {
      id: "2",
      type: "success",
      title: "Payment Processed",
      message: "Monthly subscription payment of $99.99 has been successfully processed",
      time: "15 minutes ago",
      read: false,
      category: "payments"
    },
    {
      id: "3",
      type: "warning",
      title: "Low Inventory Alert",
      message: "Product 'Premium Widget' is running low on stock (5 remaining)",
      time: "1 hour ago",
      read: true,
      category: "inventory",
      actions: [
        { label: "Reorder", action: "reorder", variant: "default" },
        { label: "Dismiss", action: "dismiss", variant: "outline" }
      ]
    },
    {
      id: "4",
      type: "info",
      title: "New Team Member",
      message: "Michael Chen has joined your team as a Marketing Specialist",
      time: "2 hours ago",
      read: false,
      category: "team",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    {
      id: "5",
      type: "error",
      title: "Social Media Post Failed",
      message: "Failed to publish scheduled post to Instagram due to API error",
      time: "3 hours ago",
      read: false,
      category: "social",
      actions: [
        { label: "Retry", action: "retry", variant: "default" },
        { label: "Edit", action: "edit", variant: "outline" }
      ]
    },
    {
      id: "6",
      type: "success",
      title: "Campaign Completed",
      message: "Summer Sale campaign has ended successfully with 150% target achievement",
      time: "5 hours ago",
      read: true,
      category: "marketing"
    },
    {
      id: "7",
      type: "info",
      title: "Meeting Reminder",
      message: "Team standup meeting in 30 minutes",
      time: "1 day ago",
      read: true,
      category: "calendar"
    },
    {
      id: "8",
      type: "warning",
      title: "License Expiring",
      message: "Your Pro license will expire in 7 days",
      time: "2 days ago",
      read: false,
      category: "system",
      actions: [
        { label: "Renew", action: "renew", variant: "default" },
        { label: "Learn More", action: "learn", variant: "outline" }
      ]
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState("all");

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "reviews":
        return <Star className="w-4 h-4" />;
      case "payments":
        return <CreditCard className="w-4 h-4" />;
      case "team":
        return <Users className="w-4 h-4" />;
      case "social":
        return <MessageSquare className="w-4 h-4" />;
      case "calendar":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = selectedCategory === "all" 
    ? notifications 
    : notifications.filter(n => n.category === selectedCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const categories = [
    { id: "all", label: "All", count: notifications.length },
    { id: "reviews", label: "Reviews", count: notifications.filter(n => n.category === "reviews").length },
    { id: "payments", label: "Payments", count: notifications.filter(n => n.category === "payments").length },
    { id: "team", label: "Team", count: notifications.filter(n => n.category === "team").length },
    { id: "social", label: "Social", count: notifications.filter(n => n.category === "social").length },
    { id: "system", label: "System", count: notifications.filter(n => n.category === "system").length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Categories</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-2"
              >
                {getCategoryIcon(category.id)}
                <span>{category.label}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications in this category</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`transition-all duration-200 ${
                !notification.read 
                  ? "border-l-4 border-l-primary bg-primary/5" 
                  : "hover:shadow-md"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  {notification.avatar ? (
                    <Avatar className="w-10 h-10 mt-1">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>
                        {notification.title.split(' ').map(word => word[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-foreground">{notification.title}</h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-1 capitalize">{notification.category}</span>
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mt-1">{notification.message}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      
                      <div className="flex items-center space-x-2">
                        {notification.actions && notification.actions.map((action, index) => (
                          <Button
                            key={index}
                            variant={action.variant || "outline"}
                            size="sm"
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            {action.label}
                          </Button>
                        ))}
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
              </div>
              <input type="checkbox" className="w-4 h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}