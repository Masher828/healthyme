# Overview

HealthifyMe is a comprehensive health and fitness tracking web application that enables users to monitor their nutrition, workouts, weight progress, and overall wellness journey. The application provides a modern, mobile-first interface with features for meal logging, workout tracking, water intake monitoring, and progress visualization through charts and metrics.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side application is built using React 18 with TypeScript, utilizing a modern component-based architecture. The UI is constructed with shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. Styling is handled through Tailwind CSS with a custom design system that includes HealthifyMe-specific color variables and theming support.

The routing system uses Wouter for lightweight client-side navigation between different sections (Home, Meals, Workouts, Progress, Profile). State management is handled through React Query for server state synchronization and caching, with custom hooks for authentication and data fetching patterns.

## Backend Architecture
The server follows a REST API architecture built on Express.js with TypeScript. The application uses a layered architecture pattern with clear separation between routes, storage layer, and database operations. The server implements middleware for request logging, error handling, and authentication.

The storage layer abstracts database operations through a well-defined interface (`IStorage`) that handles all CRUD operations for users, weight entries, meals, workouts, water intake, and body measurements. This design pattern allows for easy testing and potential database migrations.

## Authentication System
Authentication is implemented using OpenID Connect (OIDC) with Replit's authentication service. The system uses Passport.js strategies for handling the OAuth flow and maintains user sessions through PostgreSQL-backed session storage. Session management includes secure cookie configuration and automatic session cleanup.

The authentication flow redirects unauthenticated users to the login endpoint and maintains user context throughout the application. Protected routes verify authentication status and handle unauthorized access gracefully.

## Database Design
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes separate tables for users, weight entries, meals, workouts, water intake, body measurements, and session storage.

Key design decisions include:
- UUID primary keys for all entities to ensure uniqueness across distributed systems
- Decimal precision for weight and measurement values to maintain accuracy
- Date-based partitioning for time-series data like weight entries and meals
- Foreign key relationships to maintain data integrity
- Automatic timestamp tracking for audit trails

## Data Validation
Input validation is handled through Zod schemas that are shared between client and server (`shared/schema.ts`). This ensures consistent validation rules across the entire application and provides TypeScript type safety. The schemas define validation for all user inputs including meal entries, workout logs, and profile updates.

## Build System and Development
The application uses Vite as the build tool for fast development and optimized production builds. The development setup includes hot module replacement, TypeScript checking, and asset optimization. The build process outputs static files for the client and bundled server code for deployment.

Development tooling includes ESBuild for server bundling, PostCSS for CSS processing, and Tailwind CSS for utility-first styling. The configuration supports both development and production environments with appropriate optimizations.

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