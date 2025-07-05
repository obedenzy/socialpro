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
  DashboardMetrics,
  OutboundCampaign,
  PromoLandingPage
} from '@shared/schema';

export class LocalStorage {
  private static getItem<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : [];
    } catch {
      return [];
    }
  }

  private static setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving to localStorage:`, error);
    }
  }

  // Reviews
  static getReviews(): Review[] {
    return this.getItem<Review>('reviews');
  }

  static saveReviews(reviews: Review[]): void {
    this.setItem('reviews', reviews);
  }

  // Social Posts
  static getSocialPosts(): SocialPost[] {
    return this.getItem<SocialPost>('socialPosts');
  }

  static saveSocialPosts(posts: SocialPost[]): void {
    this.setItem('socialPosts', posts);
  }

  // Chat Conversations
  static getChatConversations(): ChatConversation[] {
    return this.getItem<ChatConversation>('chatConversations');
  }

  static saveChatConversations(conversations: ChatConversation[]): void {
    this.setItem('chatConversations', conversations);
  }

  // Calendar Events
  static getCalendarEvents(): CalendarEvent[] {
    return this.getItem<CalendarEvent>('calendarEvents');
  }

  static saveCalendarEvents(events: CalendarEvent[]): void {
    this.setItem('calendarEvents', events);
  }

  // Post Cards
  static getPostCards(): PostCard[] {
    return this.getItem<PostCard>('postCards');
  }

  static savePostCards(cards: PostCard[]): void {
    this.setItem('postCards', cards);
  }

  // Promotions
  static getPromotions(): Promotion[] {
    return this.getItem<Promotion>('promotions');
  }

  static savePromotions(promotions: Promotion[]): void {
    this.setItem('promotions', promotions);
  }

  // Emails
  static getEmails(): Email[] {
    return this.getItem<Email>('emails');
  }

  static saveEmails(emails: Email[]): void {
    this.setItem('emails', emails);
  }

  // Users
  static getUsers(): User[] {
    return this.getItem<User>('users');
  }

  static saveUsers(users: User[]): void {
    this.setItem('users', users);
  }

  // Payments
  static getPayments(): Payment[] {
    return this.getItem<Payment>('payments');
  }

  static savePayments(payments: Payment[]): void {
    this.setItem('payments', payments);
  }

  // Dashboard Metrics
  static getDashboardMetrics(): DashboardMetrics | null {
    try {
      const item = localStorage.getItem('dashboardMetrics');
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  static saveDashboardMetrics(metrics: DashboardMetrics): void {
    this.setItem('dashboardMetrics', [metrics]);
  }
}
