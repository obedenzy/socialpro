import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Share2, Users, DollarSign, TrendingUp, Eye } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { LocalStorage } from "@/lib/storage";
import type { DashboardMetrics } from "@shared/schema";

const chartData = [
  { name: "Jan", reviews: 240, posts: 89, users: 180, revenue: 4200 },
  { name: "Feb", reviews: 300, posts: 112, users: 210, revenue: 5100 },
  { name: "Mar", reviews: 280, posts: 95, users: 190, revenue: 4800 },
  { name: "Apr", reviews: 320, posts: 128, users: 245, revenue: 5800 },
  { name: "May", reviews: 380, posts: 156, users: 290, revenue: 6900 },
  { name: "Jun", reviews: 420, posts: 189, users: 340, revenue: 7800 },
];

const performanceData = [
  { name: "Week 1", engagement: 65, conversion: 45, satisfaction: 85 },
  { name: "Week 2", engagement: 70, conversion: 50, satisfaction: 88 },
  { name: "Week 3", engagement: 68, conversion: 48, satisfaction: 82 },
  { name: "Week 4", engagement: 75, conversion: 55, satisfaction: 90 },
];

const userDistributionData = [
  { name: "Active Users", value: 68, color: "#3b82f6" },
  { name: "Inactive Users", value: 22, color: "#6b7280" },
  { name: "New Users", value: 10, color: "#10b981" },
];

const revenueSourceData = [
  { name: "Subscriptions", value: 45, color: "#8b5cf6" },
  { name: "One-time Purchases", value: 30, color: "#f59e0b" },
  { name: "Premium Features", value: 25, color: "#ef4444" },
];

const COLORS = ['#3b82f6', '#6b7280', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

const recentActivity = [
  {
    id: 1,
    type: "review",
    message: "New 5-star review received",
    time: "2 minutes ago",
    icon: Star,
    color: "text-blue-600 bg-blue-100"
  },
  {
    id: 2,
    type: "social",
    message: "Social media post published",
    time: "15 minutes ago",
    icon: Share2,
    color: "text-green-600 bg-green-100"
  },
  {
    id: 3,
    type: "user",
    message: "New user registered",
    time: "1 hour ago",
    icon: Users,
    color: "text-purple-600 bg-purple-100"
  }
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    const savedMetrics = LocalStorage.getDashboardMetrics();
    if (savedMetrics) {
      setMetrics(savedMetrics);
    }
  }, []);

  if (!metrics) {
    return <div>Loading...</div>;
  }

  const metricCards = [
    {
      title: "Total Reviews",
      value: metrics.totalReviews.toLocaleString(),
      growth: metrics.reviewsGrowth,
      icon: Star,
      color: "text-blue-600 bg-blue-100"
    },
    {
      title: "Social Posts",
      value: metrics.totalPosts.toLocaleString(),
      growth: metrics.postsGrowth,
      icon: Share2,
      color: "text-green-600 bg-green-100"
    },
    {
      title: "Active Users",
      value: metrics.activeUsers.toLocaleString(),
      growth: metrics.usersGrowth,
      icon: Users,
      color: "text-purple-600 bg-purple-100"
    },
    {
      title: "Revenue",
      value: `$${metrics.revenue.toLocaleString()}`,
      growth: metrics.revenueGrowth,
      icon: DollarSign,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="metric-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-2xl font-semibold text-foreground">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${card.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+{card.growth}%</span>
                  <span className="text-muted-foreground ml-2">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analytics Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Analytics Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reviews" fill="hsl(var(--chart-1))" />
                <Bar dataKey="posts" fill="hsl(var(--chart-2))" />
                <Bar dataKey="users" fill="hsl(var(--chart-3))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="engagement" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                <Line type="monotone" dataKey="conversion" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                <Line type="monotone" dataKey="satisfaction" stroke="hsl(var(--chart-3))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Pie Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              {userDistributionData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-foreground">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueSourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {revenueSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col space-y-2 mt-4">
              {revenueSourceData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-foreground">{entry.name}: {entry.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
