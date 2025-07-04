import { z } from "zod";

// Review Schema
export const reviewSchema = z.object({
  id: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerAvatar: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  date: z.string(),
  status: z.enum(["pending", "responded", "archived"]),
  response: z.string().optional(),
});

export type Review = z.infer<typeof reviewSchema>;

// Social Media Schema
export const socialPostSchema = z.object({
  id: z.string(),
  content: z.string(),
  platform: z.enum(["facebook", "twitter", "instagram", "linkedin"]),
  scheduledDate: z.string(),
  publishedDate: z.string().optional(),
  status: z.enum(["draft", "scheduled", "published", "failed"]),
  metrics: z.object({
    likes: z.number(),
    comments: z.number(),
    shares: z.number(),
    views: z.number(),
  }),
});

export type SocialPost = z.infer<typeof socialPostSchema>;

// Chat Bot Schema
export const chatMessageSchema = z.object({
  id: z.string(),
  content: z.string(),
  sender: z.enum(["user", "bot"]),
  timestamp: z.string(),
  type: z.enum(["text", "image"]),
  imageUrl: z.string().optional(),
});

export const chatConversationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  userName: z.string(),
  messages: z.array(chatMessageSchema),
  startedAt: z.string(),
  lastMessageAt: z.string(),
  status: z.enum(["active", "resolved", "pending"]),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatConversation = z.infer<typeof chatConversationSchema>;

// Calendar Schema
export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  type: z.enum(["meeting", "task", "reminder", "event"]),
  priority: z.enum(["low", "medium", "high"]),
  participants: z.array(z.string()),
  status: z.enum(["scheduled", "completed", "cancelled"]),
});

export type CalendarEvent = z.infer<typeof calendarEventSchema>;

// Post Card Schema
export const postCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  imageUrl: z.string(),
  author: z.string(),
  category: z.string(),
  tags: z.array(z.string()),
  views: z.number(),
  likes: z.number(),
  publishDate: z.string(),
  status: z.enum(["draft", "published", "archived"]),
});

export type PostCard = z.infer<typeof postCardSchema>;

// Promotion Schema
export const promotionSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  description: z.string(),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.number(),
  minOrderAmount: z.number().optional(),
  maxUsage: z.number(),
  currentUsage: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.enum(["active", "expired", "disabled"]),
});

export type Promotion = z.infer<typeof promotionSchema>;

// Email Schema
export const emailSchema = z.object({
  id: z.string(),
  subject: z.string(),
  content: z.string(),
  sender: z.string(),
  recipient: z.string(),
  timestamp: z.string(),
  status: z.enum(["sent", "received", "draft", "archived"]),
  isRead: z.boolean(),
  folder: z.enum(["inbox", "sent", "drafts", "spam", "trash"]),
  priority: z.enum(["low", "normal", "high"]),
});

export type Email = z.infer<typeof emailSchema>;

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  avatar: z.string(),
  role: z.enum(["admin", "user", "moderator"]),
  status: z.enum(["active", "inactive", "suspended"]),
  lastLogin: z.string(),
  joinDate: z.string(),
  permissions: z.array(z.string()),
});

export type User = z.infer<typeof userSchema>;

// Payment Schema
export const paymentSchema = z.object({
  id: z.string(),
  transactionId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerAvatar: z.string(),
  amount: z.number(),
  currency: z.string(),
  method: z.enum(["visa", "mastercard", "paypal", "stripe", "bank_transfer"]),
  status: z.enum(["success", "pending", "failed", "refunded"]),
  date: z.string(),
  description: z.string(),
});

export type Payment = z.infer<typeof paymentSchema>;

// Dashboard Metrics Schema
export const dashboardMetricsSchema = z.object({
  totalReviews: z.number(),
  totalPosts: z.number(),
  activeUsers: z.number(),
  revenue: z.number(),
  reviewsGrowth: z.number(),
  postsGrowth: z.number(),
  usersGrowth: z.number(),
  revenueGrowth: z.number(),
});

export type DashboardMetrics = z.infer<typeof dashboardMetricsSchema>;
