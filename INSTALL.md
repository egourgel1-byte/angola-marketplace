# Installation Checklist

## Pre-Installation Requirements

### System Requirements
- [ ] Windows 10/11, macOS, or Linux
- [ ] 4GB RAM minimum (8GB recommended)
- [ ] 2GB free disk space
- [ ] Internet connection

### Required Software
- [ ] Node.js 18 or higher ([Download](https://nodejs.org))
- [ ] PostgreSQL 13 or higher ([Download](https://www.postgresql.org))
- [ ] Code editor (VS Code recommended)
- [ ] Git (optional, for version control)

### Verify Installations
```bash
# Check Node.js version
node --version
# Should show: v18.x.x or higher

# Check npm version
npm --version
# Should show: 9.x.x or higher

# Check PostgreSQL
psql --version
# Should show: psql (PostgreSQL) 13.x or higher
```

---

## Installation Steps

### Step 1: Project Setup ✓
- [ ] Navigate to project directory
```bash
cd "C:\Users\User\Documents\chatbot_ia_negocios\site negocio angola"
```

- [ ] Verify project files exist
```bash
# Should see: package.json, prisma/, app/, etc.
dir
```

### Step 2: Install Dependencies ✓
- [ ] Install npm packages
```bash
npm install
```

- [ ] Wait for installation (2-5 minutes)
- [ ] Verify no errors in terminal

Expected output:
```
added 320 packages, and audited 321 packages in 2m
found 0 vulnerabilities
```

### Step 3: Database Setup ✓

#### 3.1 Create Database
- [ ] Open PostgreSQL command line or pgAdmin
- [ ] Create database
```sql
CREATE DATABASE angola_marketplace;
```

- [ ] Verify database created
```sql
\l  -- List databases (should see angola_marketplace)
```

#### 3.2 Configure Environment
- [ ] Copy environment template
```bash
copy env.example .env
```

- [ ] Open `.env` file in editor
- [ ] Update DATABASE_URL
```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/angola_marketplace"
```

Replace:
- `YOUR_USERNAME`: Your PostgreSQL username (default: postgres)
- `YOUR_PASSWORD`: Your PostgreSQL password

- [ ] Update JWT_SECRET
```env
JWT_SECRET="your-long-random-secret-key-at-least-32-characters"
```

- [ ] Update NEXTAUTH_SECRET
```env
NEXTAUTH_SECRET="another-long-random-secret-key"
```

#### 3.3 Initialize Database
- [ ] Generate Prisma client
```bash
npm run db:generate
```

Expected output:
```
✔ Generated Prisma Client
```

- [ ] Push schema to database
```bash
npm run db:push
```

Expected output:
```
✔ Your database is now in sync with your Prisma schema.
```

- [ ] Seed initial data (optional)
```bash
npm run db:seed
```

Expected output:
```
Seed data created successfully
```

### Step 4: Start Development Server ✓
- [ ] Start the server
```bash
npm run dev
```

Expected output:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

- [ ] Verify server is running
- [ ] Terminal should show "Ready in X seconds"

### Step 5: Verify Installation ✓
- [ ] Open browser
- [ ] Navigate to: http://localhost:3000
- [ ] Landing page should load
- [ ] No errors in browser console (F12)

### Step 6: Test Core Features ✓

#### Test Registration
- [ ] Go to: http://localhost:3000/register
- [ ] Fill registration form
- [ ] Submit
- [ ] Should redirect to login page

#### Test Login
- [ ] Go to: http://localhost:3000/login
- [ ] Use credentials:
  - Email: admin@example.com
  - Password: admin123
- [ ] Click "Sign In"
- [ ] Should redirect to dashboard

#### Test Dashboard
- [ ] Dashboard should load at: http://localhost:3000/dashboard
- [ ] Should see statistics (0 businesses, 0 products)
- [ ] No errors displayed

#### Test Business Listing
- [ ] Go to: http://localhost:3000/businesses
- [ ] Page should load
- [ ] Search and filters should work

#### Test Product Listing
- [ ] Go to: http://localhost:3000/products
- [ ] Page should load
- [ ] Filters should work

---

## Troubleshooting

### Issue: "Cannot connect to database"
**Solutions:**
1. [ ] Verify PostgreSQL is running
```bash
# Windows (check Services)
# Linux/Mac:
sudo systemctl status postgresql
```

2. [ ] Check DATABASE_URL in .env
3. [ ] Test database connection
```bash
psql -U YOUR_USERNAME -d angola_marketplace
```

### Issue: "Port 3000 already in use"
**Solutions:**
1. [ ] Stop other process using port 3000
2. [ ] Or use different port:
```bash
npm run dev -- -p 3001
```

### Issue: "Module not found"
**Solutions:**
1. [ ] Delete node_modules
```bash
rmdir /s node_modules
```

2. [ ] Reinstall
```bash
npm install
```

### Issue: "Prisma Client error"
**Solutions:**
1. [ ] Regenerate Prisma client
```bash
npm run db:generate
```

2. [ ] Push schema again
```bash
npm run db:push
```

### Issue: "Authentication not working"
**Solutions:**
1. [ ] Check JWT_SECRET is set in .env
2. [ ] Clear browser cookies
3. [ ] Try incognito/private mode

---

## Post-Installation Tasks

### Optional Enhancements
- [ ] Open Prisma Studio to view database
```bash
npm run db:studio
```

- [ ] Set up Git repository
```bash
git init
git add .
git commit -m "Initial commit"
```

- [ ] Configure VS Code extensions
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma

### Customization
- [ ] Change branding colors (tailwind.config.ts)
- [ ] Update site name (Header.tsx, Footer.tsx)
- [ ] Add your logo
- [ ] Customize landing page content

---

## Success Checklist ✅

Installation is successful when:
- [x] All dependencies installed
- [x] Database created and connected
- [x] Prisma schema synced
- [x] Development server running
- [x] Landing page loads (localhost:3000)
- [x] Can register new user
- [x] Can login
- [x] Dashboard accessible
- [x] No console errors

---

## Next Steps

### For Development
1. [ ] Read STRUCTURE.md for architecture
2. [ ] Review code comments
3. [ ] Start customizing features
4. [ ] Add your business logic

### For Production
1. [ ] Follow deployment guide in README.md
2. [ ] Set up production database
3. [ ] Configure environment variables
4. [ ] Set up domain and SSL

### For Learning
1. [ ] Explore the codebase
2. [ ] Try adding a new page
3. [ ] Modify existing features
4. [ ] Read Next.js documentation

---

## Verification Commands

Run these to verify everything works:

```bash
# Check build (should complete without errors)
npm run build

# Check linting (should show no errors)
npm run lint

# Check database connection
npm run db:studio
```

---

## Time Estimates

- **Installation**: 5-10 minutes
- **Configuration**: 5 minutes
- **Database Setup**: 5 minutes
- **First Run**: 2 minutes
- **Testing**: 5 minutes

**Total**: ~20-30 minutes for complete setup

---

## Support Resources

### Documentation
- [ ] README.md - Main documentation
- [ ] QUICKSTART.md - Quick setup guide
- [ ] STRUCTURE.md - Architecture details
- [ ] TREE.md - Project structure
- [ ] SUMMARY.md - Project overview

### External Resources
- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind Docs: https://tailwindcss.com/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

---

## Installation Complete! 🎉

You now have a fully functional business marketplace platform!

### What You Can Do Now:
✅ Create business listings
✅ Add products and services
✅ Manage seller accounts
✅ Browse and search
✅ Customize the platform
✅ Deploy to production

### Happy Coding! 🚀

---

**Checklist Version**: 1.0.0  
**Last Updated**: February 2026
