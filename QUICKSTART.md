# Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js 18+ installed
- [ ] PostgreSQL installed and running
- [ ] npm or yarn package manager
- [ ] Code editor (VS Code recommended)

## 5-Minute Setup

### Step 1: Install Dependencies (2 min)
```bash
npm install
```

### Step 2: Configure Environment (1 min)
```bash
# Copy environment template
copy env.example .env

# Open .env and update these values:
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/angola_marketplace"
JWT_SECRET="your-secret-key-change-this"
NEXTAUTH_SECRET="your-nextauth-secret-change-this"
```

### Step 3: Setup Database (1 min)
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npm run db:push

# (Optional) Add sample data
npm run db:seed
```

### Step 4: Start Development Server (1 min)
```bash
npm run dev
```

### Step 5: Access Application
Open browser to: http://localhost:3000

## Default Credentials (if seeded)
- **Email**: admin@example.com
- **Password**: admin123

## Common Issues & Solutions

### Database Connection Error
```
Error: Can't reach database server
```
**Solution**: 
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Create database manually: `createdb angola_marketplace`

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution**:
```bash
# Use different port
npm run dev -- -p 3001
```

### Module Not Found
```
Error: Cannot find module
```
**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

### For Sellers
1. Register account at `/register`
2. Login at `/login`
3. Create business at `/dashboard`
4. Add products to your business

### For Admins
1. Login with admin credentials
2. Access admin panel at `/admin`
3. Verify businesses
4. Monitor platform statistics

### For Developers
1. Read `README.md` for full documentation
2. Check `STRUCTURE.md` for architecture details
3. Review code comments
4. Start customizing!

## Development Workflow

### Making Changes
1. Edit files in `/app`, `/components`, or `/lib`
2. Save - Hot reload happens automatically
3. Check http://localhost:3000

### Database Changes
1. Edit `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Run `npm run db:push`

### Adding New Page
1. Create `app/your-page/page.tsx`
2. Add link in `components/layout/Header.tsx`
3. Visit `/your-page`

## Production Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Update `.env` with production values:
- Strong JWT_SECRET (32+ characters)
- Production DATABASE_URL
- NEXTAUTH_URL with your domain
- NODE_ENV="production"

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:studio        # Open Prisma Studio GUI
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Run ESLint
```

## Project URLs

- **Landing Page**: http://localhost:3000
- **Businesses**: http://localhost:3000/businesses
- **Products**: http://localhost:3000/products
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Dashboard**: http://localhost:3000/dashboard
- **Admin**: http://localhost:3000/admin
- **API Docs**: See README.md

## Getting Help

1. Check `README.md` for detailed documentation
2. Review `STRUCTURE.md` for architecture
3. Examine code comments
4. Check Next.js docs: https://nextjs.org/docs
5. Check Prisma docs: https://www.prisma.io/docs

## Success Indicators

✅ No errors in terminal
✅ http://localhost:3000 loads
✅ Can register new user
✅ Can login
✅ Can create business
✅ Database tables created

## Need More Details?

- **Full Documentation**: See `README.md`
- **Architecture**: See `STRUCTURE.md`
- **API Reference**: See README.md API section
- **Customization**: See STRUCTURE.md Extension Points

---

**You're all set! Happy coding! 🚀**
