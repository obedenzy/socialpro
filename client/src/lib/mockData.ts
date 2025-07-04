import type { 
  Review, 
  SocialPost, 
  ChatConversation, 
  CalendarEvent, 
  PostCard, 
  Promotion, 
  Email, 
  User, 
  Payment,
  DashboardMetrics
} from '@shared/schema';

export const mockReviews: Review[] = [
  {
    id: '1',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b52f4b29?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    comment: 'Excellent service and very professional team. Highly recommend!',
    date: '2024-01-15',
    status: 'responded',
    response: 'Thank you for your wonderful feedback!'
  },
  {
    id: '2',
    customerName: 'Mike Wilson',
    customerEmail: 'mike@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    rating: 4,
    comment: 'Great experience overall. Fast delivery and good quality.',
    date: '2024-01-14',
    status: 'pending'
  },
  {
    id: '3',
    customerName: 'Emily Chen',
    customerEmail: 'emily@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    comment: 'Outstanding customer service and product quality!',
    date: '2024-01-13',
    status: 'responded',
    response: 'We appreciate your kind words!'
  }
];

export const mockSocialPosts: SocialPost[] = [
  {
    id: '1',
    content: '🎉 Exciting news! We\'re launching our new feature next week. Stay tuned for more updates!',
    platform: 'facebook',
    scheduledDate: '2024-01-20T10:00:00Z',
    publishedDate: '2024-01-15T14:30:00Z',
    status: 'published',
    metrics: {
      likes: 24,
      comments: 5,
      shares: 8,
      views: 156
    }
  },
  {
    id: '2',
    content: 'Just dropped our latest blog post about productivity tips! Check it out 📝',
    platform: 'twitter',
    scheduledDate: '2024-01-18T15:00:00Z',
    status: 'scheduled',
    metrics: {
      likes: 0,
      comments: 0,
      shares: 0,
      views: 0
    }
  }
];

export const mockChatConversations: ChatConversation[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    messages: [
      {
        id: '1',
        content: 'Hello! How can I help you today?',
        sender: 'bot',
        timestamp: '2024-01-15T10:00:00Z',
        type: 'text'
      },
      {
        id: '2',
        content: 'I need help with my account',
        sender: 'user',
        timestamp: '2024-01-15T10:01:00Z',
        type: 'text'
      }
    ],
    startedAt: '2024-01-15T10:00:00Z',
    lastMessageAt: '2024-01-15T10:01:00Z',
    status: 'active'
  }
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly team sync meeting',
    startDate: '2024-01-15T14:00:00Z',
    endDate: '2024-01-15T15:00:00Z',
    type: 'meeting',
    priority: 'medium',
    participants: ['john@example.com', 'sarah@example.com'],
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Product Launch',
    description: 'Launch new product feature',
    startDate: '2024-01-20T10:00:00Z',
    endDate: '2024-01-20T12:00:00Z',
    type: 'event',
    priority: 'high',
    participants: ['team@example.com'],
    status: 'scheduled'
  }
];

export const mockPostCards: PostCard[] = [
  {
    id: '1',
    title: 'Productivity Tips',
    content: 'Essential tips for staying productive while working from home. Boost your efficiency with these proven strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=200&fit=crop',
    author: 'John Smith',
    category: 'Business',
    tags: ['productivity', 'remote-work', 'tips'],
    views: 1234,
    likes: 89,
    publishDate: '2024-01-10',
    status: 'published'
  },
  {
    id: '2',
    title: 'Design Inspiration',
    content: 'Discover the latest trends in UI/UX design. Get inspired by modern design patterns and best practices.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=200&fit=crop',
    author: 'Emma Davis',
    category: 'Design',
    tags: ['design', 'ui-ux', 'inspiration'],
    views: 987,
    likes: 67,
    publishDate: '2024-01-12',
    status: 'published'
  }
];

export const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Welcome Discount',
    code: 'WELCOME25',
    description: 'New customer discount',
    type: 'percentage',
    value: 25,
    minOrderAmount: 50,
    maxUsage: 500,
    currentUsage: 147,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active'
  },
  {
    id: '2',
    name: 'Holiday Special',
    code: 'SAVE50',
    description: 'Holiday season discount',
    type: 'fixed',
    value: 50,
    maxUsage: 200,
    currentUsage: 89,
    startDate: '2024-01-01',
    endDate: '2024-01-15',
    status: 'active'
  }
];

export const mockEmails: Email[] = [
  {
    id: '1',
    subject: 'Re: Product inquiry',
    content: 'Thank you for your interest in our product. Here are the details...',
    sender: 'sarah@example.com',
    recipient: 'support@company.com',
    timestamp: '2024-01-15T10:00:00Z',
    status: 'received',
    isRead: false,
    folder: 'inbox',
    priority: 'normal'
  },
  {
    id: '2',
    subject: 'Meeting confirmation',
    content: 'This is to confirm our meeting scheduled for tomorrow...',
    sender: 'mike@example.com',
    recipient: 'team@company.com',
    timestamp: '2024-01-15T08:00:00Z',
    status: 'received',
    isRead: true,
    folder: 'inbox',
    priority: 'high'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:00:00Z',
    joinDate: '2023-06-15',
    permissions: ['read', 'write', 'delete', 'admin']
  },
  {
    id: '2',
    name: 'Emma Davis',
    email: 'emma@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b52f4b29?w=32&h=32&fit=crop&crop=face',
    role: 'user',
    status: 'active',
    lastLogin: '2024-01-14T15:30:00Z',
    joinDate: '2023-08-20',
    permissions: ['read', 'write']
  }
];

export const mockPayments: Payment[] = [
  {
    id: '1',
    transactionId: 'TXN-001234',
    customerName: 'Alex Johnson',
    customerEmail: 'alex@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    amount: 299.99,
    currency: 'USD',
    method: 'visa',
    status: 'success',
    date: '2024-01-15',
    description: 'Premium subscription'
  },
  {
    id: '2',
    transactionId: 'TXN-001235',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b52f4b29?w=32&h=32&fit=crop&crop=face',
    amount: 149.99,
    currency: 'USD',
    method: 'paypal',
    status: 'pending',
    date: '2024-01-14',
    description: 'Basic subscription'
  }
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalReviews: 2847,
  totalPosts: 456,
  activeUsers: 1234,
  revenue: 89432,
  reviewsGrowth: 12.5,
  postsGrowth: 8.2,
  usersGrowth: 15.3,
  revenueGrowth: 22.1
};

export function initializeMockData() {
  // Initialize localStorage with mock data if empty
  if (!localStorage.getItem('reviews')) {
    localStorage.setItem('reviews', JSON.stringify(mockReviews));
  }
  if (!localStorage.getItem('socialPosts')) {
    localStorage.setItem('socialPosts', JSON.stringify(mockSocialPosts));
  }
  if (!localStorage.getItem('chatConversations')) {
    localStorage.setItem('chatConversations', JSON.stringify(mockChatConversations));
  }
  if (!localStorage.getItem('calendarEvents')) {
    localStorage.setItem('calendarEvents', JSON.stringify(mockCalendarEvents));
  }
  if (!localStorage.getItem('postCards')) {
    localStorage.setItem('postCards', JSON.stringify(mockPostCards));
  }
  if (!localStorage.getItem('promotions')) {
    localStorage.setItem('promotions', JSON.stringify(mockPromotions));
  }
  if (!localStorage.getItem('emails')) {
    localStorage.setItem('emails', JSON.stringify(mockEmails));
  }
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify(mockPayments));
  }
  if (!localStorage.getItem('dashboardMetrics')) {
    localStorage.setItem('dashboardMetrics', JSON.stringify(mockDashboardMetrics));
  }
}
