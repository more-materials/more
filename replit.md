# MED-A Content Extension System

## Overview

MED-A Content Extension System is a web-based learning content delivery platform designed to extend an existing Android app called MED-A. The system provides additional educational materials (past papers, notes, books, and FQE content) that cannot be bundled in the locally-installed Android app. When accessed through the Android app's WebView, it appears as a native section of MED-A rather than a separate website.

The system has two completely separate sides:
- **Student Side**: Public, no authentication required. Students are identified only via `device_id` and `email` stored in localStorage by the Android app.
- **Admin Dashboard**: Private, authenticated via Firebase Authentication. Admin accounts are manually created (no signup flow).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and UI animations
- **Forms**: React Hook Form with Zod validation via @hookform/resolvers
- **Build Tool**: Vite with custom plugins for Replit environment

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod schema validation
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Data Storage
- **Database**: PostgreSQL (required via DATABASE_URL environment variable)
- **Schema Location**: `shared/schema.ts` - defines tables for classes, content, and admins
- **Migrations**: Drizzle Kit with output to `./migrations` directory

### Key Data Models
- **Classes**: Educational class/course categories
- **Content**: Learning materials with type (past_paper, notes, book, fqe), optional password protection
- **Admins**: Admin user accounts for dashboard access

### Authentication Strategy
- **Student Side**: No authentication - identity via localStorage (device_id, email)
- **Admin Side**: Firebase Authentication (configuration to be provided by user)
- **Subscription Verification**: External payment server integration for checking student subscription status

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components including shadcn/ui
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities and query client
│       └── pages/        # Route pages
├── server/           # Express backend
│   ├── routes.ts     # API endpoint handlers
│   ├── storage.ts    # Database operations
│   └── db.ts         # Database connection
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   └── routes.ts     # API route definitions with Zod schemas
└── migrations/       # Database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via DATABASE_URL environment variable
- **Drizzle ORM**: Database toolkit for type-safe queries and migrations

### Authentication (Planned)
- **Firebase Authentication**: For admin dashboard login (user must provide Firebase configuration)

### External Services
- **External Payment Server**: For verifying student subscription status (integration pending)

### Key NPM Packages
- `@tanstack/react-query`: Server state management
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `zod` / `drizzle-zod`: Schema validation
- `framer-motion`: Animations
- `wouter`: Client-side routing
- `express`: HTTP server
- `react-hook-form`: Form state management

### Asset URLs
- System Logo: `https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20250906_184426881.png`
- KMTC Logo: `https://raw.githubusercontent.com/MODERN-SERVER/Assets/main/BackgroundEraser_20251010_092733868.png`