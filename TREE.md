# Project Tree Structure

```
angola-business-marketplace/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript config
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.ts        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── .gitignore                # Git ignore rules
│   └── env.example               # Environment template
│
├── 📚 Documentation
│   ├── README.md                 # Main documentation
│   ├── STRUCTURE.md              # Architecture details
│   ├── QUICKSTART.md             # Quick setup guide
│   └── TREE.md                   # This file
│
├── 🎨 app/ - Next.js App Router
│   │
│   ├── 🔐 (auth)/ - Authentication Pages
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   │
│   ├── 📊 (dashboard)/ - Protected Routes
│   │   └── dashboard/
│   │       └── page.tsx          # Seller dashboard
│   │
│   ├── 👤 admin/
│   │   └── page.tsx              # Admin dashboard
│   │
│   ├── 🌐 api/ - REST API Routes
│   │   │
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   │   └── route.ts      # POST /api/auth/login
│   │   │   ├── register/
│   │   │   │   └── route.ts      # POST /api/auth/register
│   │   │   └── me/
│   │   │       └── route.ts      # GET /api/auth/me
│   │   │
│   │   ├── businesses/
│   │   │   ├── route.ts          # GET, POST /api/businesses
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET, PUT, DELETE /api/businesses/:id
│   │   │
│   │   └── products/
│   │       ├── route.ts          # GET, POST /api/products
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE /api/products/:id
│   │
│   ├── 🏢 businesses/
│   │   ├── page.tsx              # Business listing page
│   │   └── [slug]/
│   │       └── page.tsx          # Business profile page
│   │
│   ├── 📦 products/
│   │   └── page.tsx              # Product listing page
│   │
│   ├── globals.css               # Global styles + Tailwind
│   ├── layout.tsx                # Root layout (Header + Footer)
│   └── page.tsx                  # Landing page (/)
│
├── 🧩 components/ - React Components
│   │
│   ├── layout/
│   │   ├── Header.tsx            # Navigation header
│   │   └── Footer.tsx            # Site footer
│   │
│   └── ui/
│       ├── Button.tsx            # Button component
│       ├── Input.tsx             # Input field
│       ├── Textarea.tsx          # Textarea field
│       └── Card.tsx              # Card container
│
├── 🔧 lib/ - Utilities & Helpers
│   ├── prisma.ts                 # Prisma client instance
│   ├── auth.ts                   # JWT & password utils
│   ├── api-response.ts           # API response helpers
│   ├── validations.ts            # Zod validation schemas
│   └── utils.ts                  # General utilities
│
└── 🗄️ prisma/ - Database
    ├── schema.prisma             # Database schema
    └── seed.js                   # Seed data script
```

## File Count Summary

- **Total Files**: 40
- **TypeScript Files**: 29
- **Configuration Files**: 7
- **Documentation Files**: 4

## Directory Breakdown

### Frontend (Pages & Components)
- **Pages**: 7 files
  - Landing, Login, Register, Dashboard, Admin, Businesses, Products
- **Components**: 7 files
  - 2 Layout + 5 UI components
- **API Routes**: 7 files
  - Auth (3) + Businesses (2) + Products (2)

### Backend (API & Database)
- **API Endpoints**: 7 route handlers
- **Database**: 1 schema + 1 seed file
- **Utilities**: 5 helper files

### Configuration & Docs
- **Config**: 7 files
- **Documentation**: 4 files

## Technology Stack per Folder

```
/app              → Next.js 14 (App Router), TypeScript, React
/components       → React, TypeScript, Tailwind CSS
/lib              → TypeScript, Zod, JWT, Bcrypt
/prisma           → Prisma ORM, PostgreSQL
/                 → Next.js, Tailwind, PostCSS, TypeScript
```

## Key Entry Points

1. **User Visits**: `app/page.tsx` (Landing)
2. **User Registers**: `app/(auth)/register/page.tsx`
3. **User Logs In**: `app/(auth)/login/page.tsx`
4. **Seller Dashboard**: `app/(dashboard)/dashboard/page.tsx`
5. **Browse Businesses**: `app/businesses/page.tsx`
6. **View Business**: `app/businesses/[slug]/page.tsx`
7. **Browse Products**: `app/products/page.tsx`
8. **Admin Panel**: `app/admin/page.tsx`

## API Endpoints Map

```
Authentication:
  POST   /api/auth/register    → app/api/auth/register/route.ts
  POST   /api/auth/login       → app/api/auth/login/route.ts
  GET    /api/auth/me          → app/api/auth/me/route.ts

Businesses:
  GET    /api/businesses       → app/api/businesses/route.ts
  POST   /api/businesses       → app/api/businesses/route.ts
  GET    /api/businesses/:id   → app/api/businesses/[id]/route.ts
  PUT    /api/businesses/:id   → app/api/businesses/[id]/route.ts
  DELETE /api/businesses/:id   → app/api/businesses/[id]/route.ts

Products:
  GET    /api/products         → app/api/products/route.ts
  POST   /api/products         → app/api/products/route.ts
  GET    /api/products/:id     → app/api/products/[id]/route.ts
  PUT    /api/products/:id     → app/api/products/[id]/route.ts
  DELETE /api/products/:id     → app/api/products/[id]/route.ts
```

## Component Dependency Graph

```
App Layout
    └── Header.tsx (nav, auth state)
    └── [Page Content]
        ├── Button.tsx
        ├── Input.tsx
        ├── Textarea.tsx
        └── Card.tsx
    └── Footer.tsx (links, copyright)
```

## Data Flow Diagram

```
User Interface (React Components)
         ↓
    API Routes (REST)
         ↓
   Validation (Zod)
         ↓
  Authentication (JWT)
         ↓
   Database (Prisma)
         ↓
   PostgreSQL
```

## Module Dependencies

```
Frontend Dependencies:
- next              (Framework)
- react             (UI Library)
- react-dom         (DOM Rendering)

Backend Dependencies:
- @prisma/client    (Database ORM)
- bcryptjs          (Password Hashing)
- jsonwebtoken      (Authentication)
- zod               (Validation)

Dev Dependencies:
- typescript        (Type Safety)
- tailwindcss       (Styling)
- prisma            (DB Tools)
- eslint            (Linting)
```

## Size Estimates

- **Total Lines of Code**: ~5,500 lines
  - TypeScript/React: ~3,500 lines
  - Configuration: ~200 lines
  - Documentation: ~1,800 lines
  
- **Compressed Size**: ~50 KB (excluding node_modules)
- **With Dependencies**: ~500 MB

## Scalability Points

### Easy to Scale:
1. Add new pages → Create new `/app` folders
2. Add new components → Create in `/components`
3. Add new API routes → Create in `/app/api`
4. Add new database models → Edit `prisma/schema.prisma`

### Extension Examples:
```
New Feature: Reviews
├── prisma/schema.prisma        (Add Review model)
├── app/api/reviews/route.ts    (CRUD endpoints)
├── components/ReviewCard.tsx   (UI component)
└── app/businesses/[slug]/      (Display reviews)
```

## Clean Architecture Benefits

✅ Clear separation of concerns
✅ Easy to navigate
✅ Scalable structure
✅ Maintainable code
✅ Type-safe throughout
✅ Well documented
✅ No proprietary tools
✅ Framework best practices

---

**Last Updated**: February 2026
**Version**: 1.0.0
