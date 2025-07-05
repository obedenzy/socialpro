# SaaS Management Platform - VELZON

## Overview

This is a comprehensive SaaS management platform built with React and TypeScript, featuring a modern frontend-only architecture with local storage persistence. The application provides a complete suite of business management tools including review management, social media scheduling, chatbot functionality, calendar management, post card management, promotions, email handling, user management, and payment processing. The design follows the professional VELZON theme with a dark sidebar and clean modern interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Local Storage**: Custom LocalStorage wrapper for data persistence

### Data Management
- **Local Storage**: Browser localStorage for data persistence
- **Schema Definition**: Zod schemas for runtime validation and type safety
- **Mock Data**: Comprehensive mock datasets for all functionality
- **State Management**: React hooks with localStorage synchronization

## Key Components

### Dashboard System
- Centralized metrics and analytics display
- Real-time data visualization with Recharts
- Performance tracking and KPI monitoring
- Activity feed with recent actions

### Review Management
- Customer review aggregation and response system
- Rating display and analytics
- Status tracking (pending, responded, archived)
- Response management workflow

### Social Media Management
- Multi-platform posting (Facebook, Twitter, Instagram, LinkedIn)
- Content scheduling and publishing
- Engagement metrics tracking
- Platform-specific optimizations

### Chat Bot Interface
- Real-time conversation management
- Multi-user chat handling
- Message type support (text, images)
- Automated response configuration

### Calendar System
- Event scheduling and management
- Visual calendar interface
- Event categorization and filtering
- Date-based event retrieval

### Promotion System
- Discount code management
- Usage tracking and analytics
- Multiple promotion types (percentage, fixed, free shipping)
- Expiration and status management

### Email Management
- Multi-folder email organization
- Read/unread status tracking
- Email threading and responses
- Search and filtering capabilities

### User Management
- User role management (admin, moderator, user)
- Activity tracking and analytics
- Status management (active, inactive, suspended)
- User registration and profile management

### Payment Processing
- Transaction tracking and management
- Payment method integration
- Revenue analytics and reporting
- Payment status monitoring

## Data Flow

### Client-Server Communication
1. Frontend makes API requests through React Query
2. Express server handles routing and middleware processing
3. Storage layer abstracts database operations
4. Responses are cached and managed by React Query

### Local Data Management
1. Mock data initialization on app startup
2. LocalStorage persistence for client-side data
3. Optimistic updates with server synchronization
4. Automatic data revalidation and caching

### State Management Flow
1. Components trigger actions through React Query mutations
2. Server state is automatically synchronized
3. Local state updates trigger UI re-renders
4. Error handling and loading states are managed globally

## External Dependencies

### UI and Styling
- Radix UI primitives for accessible components
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Recharts for data visualization

### Development Tools
- Vite for build tooling and development server
- TypeScript for type safety
- ESBuild for fast bundling
- Replit-specific plugins for development environment

### Database and Backend
- Drizzle ORM for database operations
- Neon Database for serverless PostgreSQL
- Express.js for API routing
- Connect-pg-simple for session management

## Deployment Strategy

### Development Environment
- Vite development server with HMR
- Express server running in development mode
- In-memory storage for rapid prototyping
- Replit-specific development tools integration

### Production Build
- Vite builds optimized frontend bundle
- ESBuild compiles server code
- Static assets served from Express
- Database migrations applied via Drizzle Kit

### Environment Configuration
- Environment-specific configuration
- Database URL configuration for PostgreSQL
- Development vs production mode handling
- Replit environment detection and optimization

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 05, 2025: Major feature expansion with outbound communications and enhanced promotions
  - Added comprehensive Outbound Communications page with Twilio API integration
  - Implemented CSV upload for phone numbers and emails for bulk campaigns
  - Created customizable SMS, email, and calling campaign forms with templates
  - Added campaign analytics with delivery rates, responses, and performance tracking
  - Enhanced Promotions with dynamic landing page creation and QR code generation
  - Implemented image upload for promotional materials
  - Created public landing pages with dynamic URLs based on user ID
  - Added QR code generation and download functionality for SMS integration
  - Updated navigation with new "Outbound Comms" section
  - Fixed calendar layout to exactly match provided reference design

- July 04, 2025: Enhanced SaaS management platform with advanced features
  - Added interactive pie charts to dashboard for user distribution and revenue sources
  - Created comprehensive user profile page with tabs for personal info, security, activity, and preferences
  - Implemented notifications system with categorized alerts, filtering, and action buttons
  - Added notification bell with unread count in header
  - Enhanced header with clickable profile link and notifications
  - All new features integrate seamlessly with existing VELZON theme
  - Complete navigation support for new pages

## Changelog

- July 04, 2025: Initial project setup and complete feature implementation