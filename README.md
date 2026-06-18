# Highway Express - हाइवे एक्सप्रेस

A professional Nepali news portal for KP Ghimire, operated from Dang, Nepal.

## Project Overview

Highway Express is a full-stack digital news platform built with:
- **Frontend:** Next.js 16, React 19, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT-based admin authentication

## Features

- Full Nepali Unicode support
- Responsive design (mobile, tablet, desktop)
- Breaking news ticker
- Featured articles
- Category management
- Admin dashboard
- Image uploads
- Search functionality
- SEO optimized
- Social sharing

## Installation

### Prerequisites
- Node.js 18+ 
- npm 9+

### Steps

```bash
# 1. Clone or copy the project
cd highway-express

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your settings

# 4. Run database migrations
npx prisma migrate dev

# 5. Seed the database with sample data
npm run seed

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Locally

```bash
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Production server
```

## Database Setup

The project uses SQLite which requires no separate database server.

```bash
# Run migrations
npm run db:migrate

# Open Prisma Studio (visual database editor)
npm run db:studio

# Seed with sample data
npm run seed
```

## Admin Panel

Access the admin panel at: `http://localhost:3000/admin`

Default credentials:
- **Username:** `admin`
- **Password:** `highway2024`

⚠️ **Change the password in production!**

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for detailed usage instructions.

## Project Structure

```
highway-express/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   ├── categories/         # Category pages
│   ├── news/               # News article pages
│   ├── about/              # About page
│   ├── search/             # Search page
│   └── layout.tsx          # Root layout
├── components/
│   ├── layout/             # Header, Footer, Navbar
│   └── news/               # Article cards, section headers
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── auth.ts             # JWT authentication
│   └── utils.ts            # Helper functions
├── public/
│   └── uploads/            # User-uploaded images
├── scripts/
│   └── backup.sh           # Backup script
├── proxy.ts                # Route protection middleware
├── ADMIN_GUIDE.md          # Admin usage guide
└── .env.example            # Environment variables template
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-here"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

Note: For Vercel deployment, switch to PostgreSQL (the free tier from Neon or Supabase) instead of SQLite.

### Option 2: VPS (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone project
git clone <your-repo> /var/www/highway-express
cd /var/www/highway-express

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name "highway-express" -- start
pm2 save
pm2 startup

# Configure Nginx reverse proxy
# Point your domain to localhost:3000
```

## Backup

```bash
npm run backup
```
This creates a timestamped backup in the `backups/` directory containing the database and all uploaded images.

## Updating the Website

To add new features or update the website:

1. Edit the relevant files
2. Run `npm run build` to check for errors
3. Restart the server: `pm2 restart highway-express` (on VPS)

## Support

For technical support, contact the developer or refer to [ADMIN_GUIDE.md](./ADMIN_GUIDE.md).

---

Built for KP Ghimire | Highway Express | Dang, Nepal
