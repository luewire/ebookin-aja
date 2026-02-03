# Setup Guide - EbookIn Platform

This guide will help you set up the EbookIn platform from scratch.

---

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon, Supabase, or local)
- Firebase project
- Midtrans account (sandbox for testing)
- Code editor (VS Code recommended)

---

## Step 1: Clone and Install Dependencies

```bash
# Navigate to project directory
cd ebookin-aja-main

# Install dependencies
npm install

# Install additional required packages (if not already installed)
npm install prisma @prisma/client firebase-admin --legacy-peer-deps
```

---

## Step 2: Set Up PostgreSQL Database

### Option A: Neon (Recommended for production)

1. Go to [Neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection strings:
   - **Pooled connection** (for the app)
   - **Direct connection** (for migrations)

### Option B: Supabase

1. Go to [Supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy connection strings

### Option C: Local PostgreSQL

```bash
# Install PostgreSQL
# Create database
createdb ebookin_db

# Connection string format
postgresql://username:password@localhost:5432/ebookin_db
```

---

## Step 3: Set Up Firebase

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google (optional)

### Get Firebase Config (Client-side)

1. Go to Project Settings > General
2. Scroll to "Your apps"
3. Click "Web" icon (</>)
4. Register app and copy config values

### Get Firebase Admin SDK (Server-side)

1. Go to Project Settings > Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely
4. Extract these values:
   - `project_id`
   - `client_email`
   - `private_key`

---

## Step 4: Set Up Midtrans

### Create Midtrans Account

1. Go to [Midtrans](https://midtrans.com)
2. Sign up for an account
3. Go to Settings > Access Keys
4. Copy:
   - **Server Key**
   - **Client Key**

### Configure Webhook (after deployment)

1. Go to Settings > Configuration
2. Set Payment Notification URL: `https://your-domain.com/api/webhooks/midtrans`
3. Enable notifications

---

## Step 5: Configure Environment Variables

Create `.env` file in the project root:

```env
# Database
# Main connection (Pooled) - Used for the website
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Direct connection (Unpooled) - Used for migrations
DIRECT_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Firebase Admin (Server-side only - NEVER expose to client)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"

# Firebase Client (Public - safe to expose)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY="your-server-key"
MIDTRANS_CLIENT_KEY="your-client-key"
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="your-client-key"
MIDTRANS_IS_PRODUCTION="false"  # Set to "true" for production

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Change for production
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- For `FIREBASE_PRIVATE_KEY`, keep the `\n` for line breaks
- Never commit `.env` file to version control
- Use different values for staging/production

---

## Step 6: Initialize Database

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
# Push schema to database (for development)
npx prisma db push

# OR create and run migrations (for production)
npx prisma migrate dev --name init
```

### Verify Database Setup

```bash
# Open Prisma Studio to view database
npx prisma studio
```

This opens a browser interface at `http://localhost:5555`

---

## Step 7: Create First Admin User

You need to create an admin user manually since you can't make yourself admin through the UI.

### Method 1: Using Prisma Studio

1. Run `npx prisma studio`
2. Sign up a regular user through your app first
3. In Prisma Studio, go to the `User` table
4. Find your user and change `role` from `USER` to `ADMIN`

### Method 2: Using SQL

```sql
-- First, sign up through Firebase Auth on your app
-- Then run this SQL query (replace with your email)

UPDATE "User"
SET role = 'ADMIN'
WHERE email = 'your-admin-email@example.com';
```

### Method 3: Using Prisma Client Script

Create a file `scripts/create-admin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.error('Usage: ts-node scripts/create-admin.ts <email>');
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: 'ADMIN' },
  });

  console.log('✅ Admin user created:', user);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx ts-node scripts/create-admin.ts your-email@example.com
```

---

## Step 8: Run Development Server

```bash
npm run dev
```

The app should be running at `http://localhost:3000`

---

## Step 9: Test the Setup

### Test Authentication

1. Go to `/register`
2. Sign up with email/password
3. Check that user appears in database
4. Login and verify you get a token

### Test Admin Access

1. Make sure you created an admin user (Step 7)
2. Login as admin
3. Navigate to `/admin`
4. You should see the admin dashboard

### Test Subscription Flow

1. Login as a regular user
2. Go to `/pricing`
3. Select a plan
4. Complete payment in Midtrans sandbox:
   - Use test card numbers from [Midtrans Docs](https://docs.midtrans.com/en/technical-reference/sandbox-test)
   - Successful payment: `4811 1111 1111 1114`
5. Check that subscription is activated
6. Try accessing a premium ebook

---

## Step 10: Add Sample Data

### Create Sample Ebooks

Use the admin dashboard or create a script:

```typescript
// scripts/seed-ebooks.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.ebook.createMany({
    data: [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        description: 'A classic American novel',
        coverUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
        pdfUrl: 'https://your-storage.com/gatsby.pdf',
        category: 'Fiction',
        isPremium: false,
        isActive: true,
        priority: 10,
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        description: 'A gripping tale of justice',
        coverUrl: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
        pdfUrl: 'https://your-storage.com/mockingbird.pdf',
        category: 'Fiction',
        isPremium: true,
        isActive: true,
        priority: 9,
      },
    ],
  });

  console.log('✅ Sample ebooks created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:
```bash
npx ts-node scripts/seed-ebooks.ts
```

### Create Sample Banners

```typescript
// scripts/seed-banners.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.banner.createMany({
    data: [
      {
        title: 'Welcome to EbookIn',
        subtitle: 'Access thousands of premium ebooks',
        ctaLabel: 'Get Started',
        ctaLink: '/register',
        imageUrl: 'https://your-storage.com/banner1.jpg',
        isActive: true,
        priority: 10,
      },
    ],
  });

  console.log('✅ Sample banners created');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## Step 11: Test API Endpoints

### Using cURL

```bash
# 1. Get Firebase token (from browser console after login)
TOKEN="your-firebase-id-token"

# 2. Get current user
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/auth/me

# 3. Get subscription status
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/subscriptions/status

# 4. List ebooks
curl http://localhost:3000/api/ebooks

# 5. Admin: Get stats
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/admin/stats
```

### Using Postman

Import this collection:
1. Create a new collection
2. Add requests for each endpoint from API_DOCUMENTATION.md
3. Use environment variables for token and base URL

---

## Step 12: Deploy to Production

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add DATABASE_URL
vercel env add FIREBASE_PRIVATE_KEY
# ... add all other env vars

# Deploy to production
vercel --prod
```

### Update Midtrans Webhook URL

After deployment:
1. Go to Midtrans Dashboard
2. Settings > Configuration
3. Set Notification URL to: `https://your-domain.vercel.app/api/webhooks/midtrans`

### Update Environment Variables

```env
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
MIDTRANS_IS_PRODUCTION="true"  # If ready for production
```

---

## Troubleshooting

### "Prisma Client not found"

```bash
npx prisma generate
```

### "Firebase token invalid"

- Check Firebase project ID matches
- Verify private key is correctly formatted with `\n`
- Ensure token hasn't expired (tokens are valid for 1 hour)

### "Database connection failed"

- Verify DATABASE_URL is correct
- Check if database allows connections from your IP
- For Neon/Supabase, ensure connection pooling is enabled

### "Webhook not received"

- Verify Midtrans webhook URL is correct
- Check if URL is publicly accessible
- Review Midtrans dashboard for webhook logs
- Check your API logs for webhook processing

### "Subscription not activating"

1. Check AdminEvent table for errors
2. Verify webhook signature matches
3. Check transaction status in Midtrans dashboard
4. Ensure MIDTRANS_SERVER_KEY is correct

---

## Security Checklist

Before going to production:

- [ ] All `.env` files are in `.gitignore`
- [ ] Firebase private key is secure
- [ ] Midtrans keys are from production (not sandbox)
- [ ] Database has secure password
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled
- [ ] SSL/HTTPS is enforced
- [ ] Webhook signature verification is working
- [ ] Admin routes are protected
- [ ] Error messages don't expose sensitive info

---

## Next Steps

1. **Configure Cloud Storage**: Upload ebook PDFs to S3/R2/Firebase Storage
2. **Customize UI**: Update branding, colors, logos
3. **Add Analytics**: Google Analytics, Plausible, etc.
4. **Set Up Monitoring**: Sentry for error tracking
5. **Configure Email**: Welcome emails, subscription confirmations
6. **Add More Features**: Reviews, ratings, wishlists, etc.

---

## Support

For issues or questions:
1. Check API_DOCUMENTATION.md for API reference
2. Check ARCHITECTURE.md for system design
3. Review Prisma schema for data model
4. Check application logs for errors

---

## Useful Commands

```bash
# Development
npm run dev                    # Start dev server
npx prisma studio             # Open database GUI
npx prisma db push            # Sync schema to database

# Database
npx prisma generate           # Generate Prisma Client
npx prisma migrate dev        # Create and run migration
npx prisma migrate deploy     # Run migrations in production
npx prisma db seed            # Run seed script

# Production
npm run build                 # Build for production
npm start                     # Start production server

# Debugging
npm run lint                  # Run linter
npx prisma validate           # Validate schema
```

---

You're now ready to build and deploy your subscription-based ebook platform! 🚀
