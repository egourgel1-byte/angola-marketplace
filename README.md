# Angola Business Marketplace

A clean, scalable, and editable web platform for a business marketplace focused on Angola and Africa. Built with modern technologies and best practices.

## 🚀 Technology Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Node.js with REST API
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript
- **Authentication**: JWT with httpOnly cookies

## 📁 Project Structure

```
angola-business-marketplace/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                   # Authentication routes (grouped)
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Dashboard routes (grouped)
│   │   └── dashboard/           # Seller dashboard
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # REST API routes
│   │   ├── auth/               # Authentication endpoints
│   │   │   ├── login/          # POST /api/auth/login
│   │   │   ├── register/       # POST /api/auth/register
│   │   │   └── me/             # GET /api/auth/me
│   │   ├── businesses/         # Business CRUD endpoints
│   │   │   ├── [id]/           # GET/PUT/DELETE /api/businesses/:id
│   │   │   └── route.ts        # GET/POST /api/businesses
│   │   └── products/           # Product CRUD endpoints
│   │       ├── [id]/           # GET/PUT/DELETE /api/products/:id
│   │       └── route.ts        # GET/POST /api/products
│   ├── businesses/              # Public business pages
│   │   ├── [slug]/             # Business profile page
│   │   └── page.tsx            # Business listing page
│   ├── products/                # Product listing page
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout with header/footer
│   └── page.tsx                # Landing page
├── components/                  # Reusable React components
│   ├── layout/                 # Layout components
│   │   ├── Header.tsx          # Navigation header
│   │   └── Footer.tsx          # Site footer
│   └── ui/                     # UI components
│       ├── Button.tsx          # Button component
│       ├── Input.tsx           # Input field component
│       ├── Textarea.tsx        # Textarea component
│       └── Card.tsx            # Card container component
├── lib/                        # Utility libraries
│   ├── prisma.ts               # Prisma client instance
│   ├── auth.ts                 # Authentication utilities
│   ├── api-response.ts         # API response helpers
│   ├── validations.ts          # Zod validation schemas
│   └── utils.ts                # General utility functions
├── prisma/                     # Database configuration
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Database seeding script
├── .gitignore                  # Git ignore rules
├── env.example                 # Environment variables template
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── postcss.config.js           # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── tsconfig.json               # TypeScript configuration
```

## 📂 Folder Explanation

### `/app` - Application Pages and Routes
- Next.js App Router directory
- Contains all pages, layouts, and API routes
- Grouped routes using `()` for better organization

### `/components` - Reusable Components
- **`/layout`**: Header, Footer, and layout components
- **`/ui`**: Reusable UI components (Button, Input, Card, etc.)

### `/lib` - Utilities and Helpers
- **`prisma.ts`**: Singleton Prisma client instance
- **`auth.ts`**: JWT token generation, validation, password hashing
- **`api-response.ts`**: Standardized API response helpers
- **`validations.ts`**: Zod schemas for input validation
- **`utils.ts`**: Helper functions (slug generation, formatting, etc.)

### `/prisma` - Database Layer
- **`schema.prisma`**: Database models and relationships
- **`seed.js`**: Initial data seeding script

## 🗄️ Database Schema

### User Model
- User authentication and profile information
- Roles: ADMIN, SELLER, USER
- One-to-many relationship with Business

### Business Model
- Business profile information
- Location, contact details, verification status
- One-to-many relationship with Product
- Belongs to User (owner)

### Product Model
- Product/service listings
- Price, images, availability
- Belongs to Business

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18 or higher
- PostgreSQL database
- npm or yarn package manager

### Installation Steps

1. **Clone or navigate to the project directory**
```bash
cd "C:\Users\User\Documents\chatbot_ia_negocios\site negocio angola"
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the example env file
copy env.example .env

# Edit .env with your configuration
```

Required environment variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/angola_marketplace"
JWT_SECRET="your-secret-key-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"
NODE_ENV="development"
```

4. **Set up the database**
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed initial data (optional)
npm run db:seed
```

5. **Run the development server**
```bash
npm run dev
```

6. **Access the application**
- Open http://localhost:3000 in your browser
- Default admin credentials (if seeded):
  - Email: admin@example.com
  - Password: admin123

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database with initial data
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Businesses
- `GET /api/businesses` - List businesses (with filters)
- `POST /api/businesses` - Create business (auth required)
- `GET /api/businesses/:id` - Get business details
- `PUT /api/businesses/:id` - Update business (auth required)
- `DELETE /api/businesses/:id` - Delete business (auth required)

### Products
- `GET /api/products` - List products (with filters)
- `POST /api/products` - Create product (auth required)
- `GET /api/products/:id` - Get product details
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

## 🎨 Core Features

### Public Features
- **Landing Page**: Hero section, features, categories, CTA
- **Business Directory**: Search, filter, browse businesses
- **Product Catalog**: Browse products and services
- **Business Profiles**: Detailed business pages with products

### Seller Features
- **User Registration**: Create seller accounts
- **Seller Dashboard**: View stats, manage businesses
- **Business Management**: Create, edit, delete businesses
- **Product Management**: Add products to businesses

### Admin Features
- **Admin Dashboard**: Platform statistics and overview
- **User Management**: (Ready structure for implementation)
- **Business Verification**: (Ready structure for implementation)

## 🎨 Design Features

- **Mobile-First**: Fully responsive design
- **Modern UI**: Clean interface with Tailwind CSS
- **Color Scheme**: 
  - Primary: Orange (#f97316)
  - Secondary: Green (#22c55e)
- **Accessible**: WCAG compliant components

## 🔒 Security Features

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection protection via Prisma
- XSS protection
- Environment variable management

## 📱 Responsive Design

All pages are mobile-first and fully responsive:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables for Production
Make sure to set secure values for:
- `JWT_SECRET`: Strong random string (min 32 characters)
- `NEXTAUTH_SECRET`: Strong random string
- `DATABASE_URL`: Production database connection
- `NODE_ENV`: "production"

## 📚 Key Configuration Files

### `next.config.js`
- Next.js configuration
- Image optimization settings

### `tailwind.config.ts`
- Custom color scheme
- Breakpoints and theme extensions

### `prisma/schema.prisma`
- Database models
- Relationships
- Indexes for performance

### `tsconfig.json`
- TypeScript configuration
- Path aliases (@/*)

## 🛠️ Customization Guide

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* your colors */ },
  secondary: { /* your colors */ },
}
```

### Adding New Features
1. Create API route in `/app/api/`
2. Add validation schema in `/lib/validations.ts`
3. Create page in `/app/`
4. Build components in `/components/`

### Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push`

## 🤝 Contributing

This is a clean, open-source platform. You can:
- Modify any code
- Add new features
- Customize the design
- Deploy to any hosting platform

## 📄 License

This project is built with no proprietary dependencies and can be freely modified and deployed.

## 🆘 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

### Build Errors
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check Node.js version (>= 18)

### Authentication Issues
- Verify JWT_SECRET is set
- Check cookie settings in production
- Ensure HTTPS in production

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments
3. Check Next.js and Prisma documentation

---

**Built with ❤️ for Angola and Africa**
