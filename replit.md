# Overview

HealthifyMe Clone is a client-only demonstration application that replicates the core functionality of a health and fitness tracking platform. Built with React, TypeScript, and modern UI components, it provides a comprehensive interface for monitoring nutrition, workouts, weight progress, and overall wellness without requiring a backend server or database.

This implementation uses mock data and localStorage for persistence, making it perfect for demonstrations, prototyping, or as a foundation for building a full-featured health app.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture (Client-Only)

## Frontend Architecture
The application is built using React 18 with TypeScript, utilizing a modern component-based architecture. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with responsive design patterns.

Key architectural decisions:
- **Single Page Application (SPA)**: Client-side routing with Wouter for lightweight navigation
- **Mock Authentication**: localStorage-based authentication system for demonstration
- **Local State Management**: React hooks and local state for data management
- **Type Safety**: Full TypeScript implementation with Zod validation schemas
- **Responsive Design**: Mobile-first approach with bottom navigation

## Authentication System (Mock)
The authentication system simulates a real login flow using localStorage for session persistence:
- Mock user data with profile information and health metrics
- Login/logout functionality with state persistence
- Protected routes that redirect unauthenticated users
- User context management through React hooks

## Data Management (Mock Data)
All application data is stored in `client/src/lib/mockData.ts` and includes:
- **User Profile**: Demo user with health stats and preferences
- **Meal Entries**: Sample meals with nutrition information
- **Workout Logs**: Exercise sessions with duration and calories
- **Weight Tracking**: Historical weight entries for progress charts
- **Water Intake**: Daily hydration tracking

## Component Architecture
- **Pages**: Main application views (Home, Meals, Workouts, Progress, Profile)
- **Components**: Reusable UI components (charts, trackers, forms)
- **Hooks**: Custom React hooks for authentication and data management
- **UI Library**: shadcn/ui components for consistent design

## Build System and Development
The application uses Vite for development and build processes:
- Hot Module Replacement for fast development
- TypeScript compilation and type checking  
- Tailwind CSS processing and optimization
- Static file generation for deployment

## Minimal Server Setup
A lightweight Express server serves the built client files and handles SPA routing:
- Static file serving from build directory
- Catch-all routing for client-side navigation
- Health check endpoint for deployment verification

# External Dependencies

## Database Services
- **Neon Database**: PostgreSQL-compatible serverless database hosting with connection pooling through `@neondatabase/serverless`
- **PostgreSQL**: Primary database engine with support for JSON columns, full-text search, and advanced indexing

## Authentication Services
- **Replit Authentication**: OpenID Connect provider for user authentication and authorization
- **Passport.js**: Authentication middleware with OpenID Connect strategy support

## UI and Styling Libraries
- **Radix UI**: Headless UI primitives for accessible component development across accordion, dialog, dropdown, form, and navigation components
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens and responsive design patterns
- **Lucide React**: SVG icon library providing consistent iconography throughout the application

## State Management and Data Fetching
- **TanStack React Query**: Server state management with caching, background updates, and optimistic updates for improved user experience
- **React Hook Form**: Form state management with validation integration and performance optimization

## Development and Build Tools
- **Vite**: Build tool and development server with TypeScript support and hot module replacement
- **Drizzle Kit**: Database migration and schema management tools for PostgreSQL
- **ESBuild**: JavaScript/TypeScript bundler for server-side code compilation

The application is designed to be easily deployable on Replit's platform with integrated authentication and database provisioning, while maintaining the flexibility to migrate to other hosting providers if needed.