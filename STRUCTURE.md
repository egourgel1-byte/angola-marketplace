# Project Structure Documentation

## Overview
This document provides a detailed explanation of the folder structure and architectural decisions for the Angola Business Marketplace platform.

## Directory Structure

### Root Level Files

#### Configuration Files
- **`package.json`**: Node.js dependencies and npm scripts
- **`tsconfig.json`**: TypeScript compiler configuration
- **`next.config.js`**: Next.js framework configuration
- **`tailwind.config.ts`**: Tailwind CSS theming and customization
- **`postcss.config.js`**: PostCSS processing configuration
- **`.gitignore`**: Git version control exclusions
- **`env.example`**: Template for environment variables

#### Documentation
- **`README.md`**: Main project documentation and setup guide
- **`STRUCTURE.md`**: This file - detailed structure explanation

---

## Application Directory (`/app`)

The `/app` directory uses Next.js 14 App Router architecture.

### Route Organization

#### Route Groups (Parentheses)
Routes wrapped in `()` are organizational groups that don't affect the URL structure:

- **`(auth)/`**: Authentication-related pages
  - `login/page.tsx` → `/login`
  - `register/page.tsx` → `/register`
  
- **`(dashboard)/`**: Protected dashboard pages
  - `dashboard/page.tsx` → `/dashboard`

#### Public Routes
- **`page.tsx`**: Landing page (`/`)
- **`businesses/`**: Business directory
  - `page.tsx` → `/businesses` (listing)
  - `[slug]/page.tsx` → `/businesses/:slug` (profile)
- **`products/`**: Product catalog
  - `page.tsx` → `/products` (listing)

#### Admin Routes
- **`admin/page.tsx`**: Admin dashboard (`/admin`)

### API Routes (`/app/api`)

RESTful API endpoints following Next.js Route Handlers pattern:

```
/app/api/
├── auth/
│   ├── register/route.ts    # POST: User registration
│   ├── login/route.ts       # POST: User login
│   └── me/route.ts          # GET: Current user info
├── businesses/
│   ├── route.ts             # GET: List, POST: Create
│   └── [id]/route.ts        # GET, PUT, DELETE: Single business
└── products/
    ├── route.ts             # GET: List, POST: Create
    └── [id]/route.ts        # GET, PUT, DELETE: Single product
```

#### API Architecture
- Each `route.ts` exports HTTP method handlers (GET, POST, PUT, DELETE)
- Centralized error handling via `/lib/api-response.ts`
- Authentication middleware via `/lib/auth.ts`
- Input validation via Zod schemas in `/lib/validations.ts`

### Layout System

- **`layout.tsx`**: Root layout wrapping all pages
  - Includes `<Header>` and `<Footer>`
  - Applies global styles from `globals.css`
  
- **`globals.css`**: Global CSS with Tailwind directives

---

## Components Directory (`/components`)

Reusable React components organized by purpose.

### `/components/ui` - UI Building Blocks

Atomic, reusable components:

- **`Button.tsx`**
  - Props: `variant`, `size`, `disabled`
  - Variants: primary, secondary, outline, danger
  - Sizes: sm, md, lg

- **`Input.tsx`**
  - Props: `label`, `error`, `helperText`
  - Built-in validation display
  - Required field indicator

- **`Textarea.tsx`**
  - Similar API to Input
  - Auto-resizable

- **`Card.tsx`**
  - Props: `padding`, `hover`
  - Consistent shadow and border styling

#### Design Principles
- All components accept `className` for extensibility
- TypeScript interfaces for props
- Accessible HTML semantics
- Responsive by default

### `/components/layout` - Layout Components

Page-level structural components:

- **`Header.tsx`**
  - Sticky navigation bar
  - Mobile hamburger menu
  - Authentication state display
  - Logo and navigation links

- **`Footer.tsx`**
  - Site map links
  - Contact information
  - Social media links
  - Copyright notice

---

## Library Directory (`/lib`)

Utility functions and shared logic.

### `/lib/prisma.ts` - Database Client

- Singleton Prisma client instance
- Hot reload protection in development
- Connection pooling configuration

```typescript
export const prisma = globalForPrisma.prisma || new PrismaClient()
```

### `/lib/auth.ts` - Authentication Utilities

Functions:
- `hashPassword()`: Bcrypt password hashing
- `comparePassword()`: Password verification
- `generateToken()`: JWT creation
- `verifyToken()`: JWT validation
- `getTokenFromRequest()`: Extract token from headers/cookies
- `verifyAuth()`: Middleware-like auth check

### `/lib/api-response.ts` - API Response Helpers

Standardized response builders:
- `successResponse()`: 200 OK responses
- `errorResponse()`: Custom error responses
- `unauthorizedResponse()`: 401 errors
- `notFoundResponse()`: 404 errors
- `validationErrorResponse()`: 422 errors
- `serverErrorResponse()`: 500 errors

Benefits:
- Consistent API contract
- Type-safe responses
- Reduced boilerplate

### `/lib/validations.ts` - Input Validation

Zod schemas for request validation:
- `registerSchema`: User registration
- `loginSchema`: User login
- `businessSchema`: Business creation/update
- `productSchema`: Product creation/update

Benefits:
- Runtime type checking
- Clear error messages
- Schema reusability

### `/lib/utils.ts` - General Utilities

Helper functions:
- `generateSlug()`: URL-safe slugs from text
- `formatPrice()`: Currency formatting
- `truncateText()`: Text truncation
- `formatDate()`: Date formatting
- `getInitials()`: Extract initials from name
- `isValidEmail()`: Email validation
- `isValidPhone()`: Phone validation

---

## Prisma Directory (`/prisma`)

Database configuration and management.

### `schema.prisma` - Database Schema

#### Models

**User**
```prisma
- id: UUID
- email: Unique
- password: Hashed
- name: String
- role: Enum (ADMIN, SELLER, USER)
- Relationships: One-to-many with Business
```

**Business**
```prisma
- id: UUID
- name, slug: String (slug is unique)
- description: Text
- category, location, city, country
- contact: phone, email, website, whatsapp
- status: isVerified, isActive
- metrics: views
- Relationships: 
  - Belongs to User (owner)
  - One-to-many with Product
```

**Product**
```prisma
- id: UUID
- name, slug: String
- description: Text
- price, currency
- images: String array
- category: String
- flags: isService, isAvailable
- stock: Optional integer
- metrics: views
- Relationships: Belongs to Business
```

#### Indexes
Strategic indexes for performance:
- Business: slug, category, city, country
- Product: slug, category, businessId

### `seed.js` - Database Seeding

Creates initial data:
- Default admin user
- Sample businesses (optional)
- Sample products (optional)

---

## Styling System

### Tailwind CSS Configuration

**Custom Colors** (`tailwind.config.ts`):
- Primary palette: Orange shades
- Secondary palette: Green shades

**Responsive Breakpoints**:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

**Design Tokens**:
- Consistent spacing scale
- Typography scale
- Shadow system

### Global Styles

`app/globals.css` includes:
- Tailwind base, components, utilities
- Custom CSS variables
- Global reset styles

---

## Separation of Concerns

### Frontend vs Backend

#### Frontend (Client Components)
- Located in `/app` (pages) and `/components`
- Marked with `'use client'` directive
- Handle user interactions
- Fetch data from API routes
- Manage local state

#### Backend (API Routes)
- Located in `/app/api`
- Server-side only
- Database operations via Prisma
- Authentication and authorization
- Business logic

#### Shared Logic
- `/lib` utilities used by both
- Type definitions
- Constants and configurations

---

## Data Flow

### Typical Request Flow

1. **User Action** → Component (`/components`)
2. **API Call** → Fetch to `/app/api/*/route.ts`
3. **Validation** → Zod schema (`/lib/validations.ts`)
4. **Authentication** → JWT verify (`/lib/auth.ts`)
5. **Database** → Prisma query (`/lib/prisma.ts`)
6. **Response** → Standardized format (`/lib/api-response.ts`)
7. **UI Update** → Component re-renders

### Example: Creating a Business

```
[Client] BusinessForm.tsx
    ↓ (POST /api/businesses)
[API] /app/api/businesses/route.ts
    ↓ (validate)
[Lib] /lib/validations.ts (businessSchema)
    ↓ (authenticate)
[Lib] /lib/auth.ts (verifyAuth)
    ↓ (create)
[Lib] /lib/prisma.ts (prisma.business.create)
    ↓ (respond)
[Lib] /lib/api-response.ts (successResponse)
    ↓
[Client] Dashboard updates
```

---

## Key Architectural Decisions

### 1. App Router over Pages Router
- Better performance with RSC
- Improved routing capabilities
- Cleaner file structure

### 2. Prisma over Raw SQL
- Type safety
- Auto-generated client
- Easy migrations
- Cross-database compatibility

### 3. Monolithic over Microservices
- Simpler deployment
- Easier development
- Sufficient for initial scale
- Can split later if needed

### 4. JWT over Session-based Auth
- Stateless authentication
- Easier horizontal scaling
- Mobile-friendly

### 5. REST over GraphQL
- Simpler to understand
- No additional dependencies
- Sufficient for CRUD operations

### 6. TypeScript over JavaScript
- Type safety
- Better IDE support
- Catch errors early
- Self-documenting code

---

## Environment Configuration

### Development
```env
NODE_ENV=development
DATABASE_URL=postgresql://localhost:5432/dev
JWT_SECRET=dev-secret
```

### Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://production-host/db
JWT_SECRET=strong-random-secret
NEXTAUTH_URL=https://yourdomain.com
```

---

## Extension Points

### Adding New Features

1. **New Page**
   - Create `app/feature/page.tsx`
   - Add link in Header component

2. **New API Endpoint**
   - Create `app/api/feature/route.ts`
   - Add validation schema in `lib/validations.ts`
   - Update types if needed

3. **New Database Model**
   - Edit `prisma/schema.prisma`
   - Run `npm run db:generate`
   - Run `npm run db:push`

4. **New Component**
   - Create in appropriate `/components` subfolder
   - Export from component file
   - Import where needed

---

## Best Practices Implemented

1. **DRY (Don't Repeat Yourself)**
   - Reusable components
   - Utility functions
   - Shared validation schemas

2. **Separation of Concerns**
   - Clear folder structure
   - API routes separate from pages
   - Business logic in utilities

3. **Type Safety**
   - TypeScript throughout
   - Prisma type generation
   - Zod runtime validation

4. **Security**
   - Input validation
   - Authentication middleware
   - SQL injection protection
   - XSS prevention

5. **Performance**
   - Database indexes
   - Optimized queries
   - Static generation where possible
   - Image optimization

6. **Maintainability**
   - Clear naming conventions
   - Comprehensive comments
   - Modular architecture
   - Documentation

---

This structure is designed to be:
- **Scalable**: Easy to add features
- **Maintainable**: Clear organization
- **Secure**: Built-in security practices
- **Performant**: Optimized for speed
- **Developer-friendly**: Easy to understand and modify
