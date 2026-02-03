# API Documentation - EbookIn Platform

## Architecture Overview

This platform uses:
- **Authentication**: Firebase Auth (client) → Backend verifies tokens → PostgreSQL storage
- **Database**: PostgreSQL with Prisma ORM
- **Payments**: Midtrans (webhook-based subscription activation)
- **Storage**: Cloud URLs for ebook PDFs and images

---

## Authentication Flow

### 1. User Registration/Login
```
Client → Firebase Auth → Get ID Token → POST /api/auth/sync → Database User Created
```

### 2. API Request Authentication
All protected endpoints require:
```
Authorization: Bearer <FIREBASE_ID_TOKEN>
```

Backend verifies token via Firebase Admin SDK and fetches user from PostgreSQL.

---

## API Endpoints

### Authentication

#### POST `/api/auth/sync`
Sync Firebase user with PostgreSQL database.

**Request:**
```json
{
  "idToken": "firebase_id_token",
  "name": "User Name (optional)"
}
```

**Response:**
```json
{
  "user": {
    "id": "cuid",
    "firebaseUid": "firebase_uid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "createdAt": "2026-02-03T00:00:00.000Z"
  }
}
```

#### GET `/api/auth/me`
Get current authenticated user with subscription info.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "cuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "USER",
    "subscription": {
      "status": "ACTIVE",
      "planName": "1month",
      "startDate": "2026-02-01T00:00:00.000Z",
      "endDate": "2026-03-01T00:00:00.000Z"
    }
  }
}
```

---

### Subscriptions

#### POST `/api/subscriptions/create`
Create a new subscription payment.

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "planName": "1month" | "3months" | "1year"
}
```

**Response:**
```json
{
  "snapToken": "midtrans_snap_token",
  "orderId": "SUB-userId-timestamp",
  "grossAmount": 25000
}
```

**Plans:**
- `1month`: Rp 25,000 (30 days)
- `3months`: Rp 70,000 (90 days)
- `1year`: Rp 240,000 (365 days)

#### GET `/api/subscriptions/status`
Get user's current subscription status.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "hasSubscription": true,
  "subscription": {
    "status": "ACTIVE",
    "planName": "1month",
    "startDate": "2026-02-01T00:00:00.000Z",
    "endDate": "2026-03-01T00:00:00.000Z",
    "isActive": true
  }
}
```

---

### Webhooks

#### POST `/api/webhooks/midtrans`
Midtrans payment notification webhook.

**Security:** Signature verification via SHA512 hash

**Handled Statuses:**
- `settlement`: Activates subscription
- `pending`: Updates transaction status
- `expire` / `cancel` / `deny`: Cancels subscription

**Important:**
- Configure this URL in Midtrans Dashboard
- Must be publicly accessible
- Returns 200 even on errors to prevent retries

---

### Ebooks (Public)

#### GET `/api/ebooks`
List active ebooks (public access).

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `search`: Search in title/author
- `premiumOnly`: Show only premium ebooks (true/false)

**Response:**
```json
{
  "ebooks": [
    {
      "id": "cuid",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Book description",
      "coverUrl": "https://...",
      "category": "Fiction",
      "isPremium": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

#### GET `/api/ebooks/[id]`
Get single ebook with access control.

**Headers:** `Authorization: Bearer <token>`

**Response (Premium + No Subscription):**
```json
{
  "error": "Premium subscription required",
  "ebook": {
    "id": "cuid",
    "title": "Book Title",
    "pdfUrl": null
  },
  "requiresSubscription": true
}
```

**Response (Success):**
```json
{
  "ebook": {
    "id": "cuid",
    "title": "Book Title",
    "author": "Author Name",
    "description": "Book description",
    "coverUrl": "https://...",
    "pdfUrl": "https://...",
    "category": "Fiction",
    "isPremium": true
  }
}
```

---

### Reading Sessions

#### POST `/api/reading-sessions`
Track reading activity (creates/updates reading log).

**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "ebookId": "cuid"
}
```

**Response:**
```json
{
  "success": true,
  "readingLog": {
    "id": "cuid",
    "startedAt": "2026-02-03T10:00:00.000Z",
    "lastReadAt": "2026-02-03T10:30:00.000Z"
  }
}
```

#### GET `/api/reading-sessions`
Get user's reading history.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "readingLogs": [
    {
      "id": "cuid",
      "startedAt": "2026-02-01T10:00:00.000Z",
      "lastReadAt": "2026-02-03T10:30:00.000Z",
      "ebook": {
        "id": "cuid",
        "title": "Book Title",
        "author": "Author Name",
        "coverUrl": "https://...",
        "category": "Fiction"
      }
    }
  ]
}
```

---

### Banners (Public)

#### GET `/api/banners`
Get active banners for homepage.

**Response:**
```json
{
  "banners": [
    {
      "id": "cuid",
      "title": "Banner Title",
      "subtitle": "Banner Subtitle",
      "ctaLabel": "Learn More",
      "ctaLink": "/pricing",
      "imageUrl": "https://...",
      "priority": 10
    }
  ]
}
```

---

### Categories (Public)

#### GET `/api/categories`
Get all unique ebook categories.

**Response:**
```json
{
  "categories": ["Fiction", "Non-Fiction", "Science", "History"]
}
```

---

## Admin Endpoints

All admin endpoints require `role: ADMIN` verification.

### Dashboard Stats

#### GET `/api/admin/stats`
Get comprehensive dashboard statistics.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Response:**
```json
{
  "stats": {
    "users": {
      "total": 1500,
      "newLast30Days": 150,
      "activeSubscribers": 450
    },
    "ebooks": {
      "total": 200,
      "active": 180,
      "totalReads": 5000
    },
    "readingSessions": {
      "active": 25
    },
    "revenue": {
      "total": 11250000,
      "transactionCount": 450
    },
    "subscriptions": {
      "breakdown": [
        { "plan": "1month", "count": 200 },
        { "plan": "3months", "count": 150 },
        { "plan": "1year", "count": 100 }
      ]
    }
  },
  "recentEvents": [
    {
      "id": "cuid",
      "type": "subscription",
      "title": "Subscription Activated",
      "description": "User subscription activated: 1month",
      "metadata": { "userId": "cuid", "orderId": "SUB-..." },
      "createdAt": "2026-02-03T10:00:00.000Z"
    }
  ]
}
```

---

### User Management

#### GET `/api/admin/users`
List all users with pagination.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `search`: Search in email/name

**Response:**
```json
{
  "users": [
    {
      "id": "cuid",
      "firebaseUid": "firebase_uid",
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER",
      "createdAt": "2026-01-01T00:00:00.000Z",
      "subscription": {
        "status": "ACTIVE",
        "planName": "1month",
        "endDate": "2026-03-01T00:00:00.000Z"
      }
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 1500, "totalPages": 30 }
}
```

#### PATCH `/api/admin/users`
Update user role.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request:**
```json
{
  "userId": "cuid",
  "role": "ADMIN" | "USER"
}
```

#### DELETE `/api/admin/users?userId=cuid`
Delete a user.

**Headers:** `Authorization: Bearer <token>` (Admin only)

---

### Ebook Management

#### GET `/api/admin/ebooks`
List all ebooks (admin view).

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Query Parameters:**
- `page`, `limit`, `search`, `category`

**Response:**
```json
{
  "ebooks": [
    {
      "id": "cuid",
      "title": "Book Title",
      "author": "Author Name",
      "description": "Description",
      "coverUrl": "https://...",
      "pdfUrl": "https://...",
      "category": "Fiction",
      "isPremium": true,
      "isActive": true,
      "priority": 10,
      "readCount": 150,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": { ... }
}
```

#### POST `/api/admin/ebooks`
Create a new ebook.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "description": "Book description",
  "coverUrl": "https://...",
  "pdfUrl": "https://...",
  "category": "Fiction",
  "isPremium": true,
  "isActive": true,
  "priority": 10
}
```

#### PATCH `/api/admin/ebooks`
Update an ebook.

**Headers:** `Authorization: Bearer <token>` (Admin only)

**Request:**
```json
{
  "id": "cuid",
  "title": "Updated Title",
  "isActive": false
}
```

#### DELETE `/api/admin/ebooks?id=cuid`
Delete an ebook.

**Headers:** `Authorization: Bearer <token>` (Admin only)

---

### Banner Management

#### GET `/api/admin/banners`
List all banners (admin view).

#### POST `/api/admin/banners`
Create a new banner.

**Request:**
```json
{
  "title": "Banner Title",
  "subtitle": "Subtitle",
  "ctaLabel": "Click Here",
  "ctaLink": "/pricing",
  "imageUrl": "https://...",
  "isActive": true,
  "priority": 10
}
```

#### PATCH `/api/admin/banners`
Update a banner.

#### DELETE `/api/admin/banners?id=cuid`
Delete a banner.

---

## Security Best Practices

### 1. Token Verification
Every protected endpoint uses `withAuth` or `withAdmin` middleware that:
- Verifies Firebase ID token
- Fetches user from PostgreSQL
- Validates role for admin endpoints

### 2. Subscription Validation
Premium content access checks:
- Query subscription from database (not client storage)
- Validate `status === 'ACTIVE'`
- Check `endDate > now()`
- Auto-expire subscriptions

### 3. Webhook Security
Midtrans webhook:
- Verifies SHA512 signature
- Logs all events to `AdminEvent` table
- Returns 200 even on errors (prevents retry loops)

### 4. Rate Limiting (Recommended)
Consider adding rate limiting middleware for:
- Authentication endpoints
- Subscription creation
- Admin operations

### 5. Error Handling
- Never expose internal errors to clients
- Log detailed errors server-side
- Return generic error messages

---

## Database Indexes

The schema includes optimized indexes for:
- User lookups: `firebaseUid`, `email`, `role`
- Subscription queries: `userId`, `status`, `endDate`
- Ebook searches: `isActive`, `isPremium`, `category`, `priority`
- Reading sessions: `lastReadAt` (for active session counts)
- Admin events: `type`, `createdAt`

---

## Deployment Checklist

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Firebase Admin
FIREBASE_PROJECT_ID="..."
FIREBASE_CLIENT_EMAIL="..."
FIREBASE_PRIVATE_KEY="..."

# Firebase Client (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."

# Midtrans
MIDTRANS_SERVER_KEY="..."
MIDTRANS_CLIENT_KEY="..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="..."
MIDTRANS_IS_PRODUCTION="true"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### Pre-Deployment Steps
1. Run `npx prisma generate`
2. Run `npx prisma migrate deploy` (production)
3. Configure Midtrans webhook URL: `https://your-domain.com/api/webhooks/midtrans`
4. Test webhook with Midtrans sandbox
5. Create first admin user manually in database
6. Set up monitoring for webhook failures

### Production Monitoring
- Monitor `AdminEvent` table for system alerts
- Track subscription activation rates
- Monitor active reading sessions
- Set up alerts for payment failures

---

## Testing

### Authentication Flow
```bash
# 1. Sign up with Firebase (client-side)
# 2. Sync with backend
curl -X POST https://your-domain.com/api/auth/sync \
  -H "Content-Type: application/json" \
  -d '{"idToken": "firebase_token", "name": "Test User"}'
```

### Subscription Flow
```bash
# 1. Create subscription
curl -X POST https://your-domain.com/api/subscriptions/create \
  -H "Authorization: Bearer firebase_token" \
  -H "Content-Type: application/json" \
  -d '{"planName": "1month"}'

# 2. Complete payment in Midtrans
# 3. Webhook activates subscription
# 4. Check status
curl https://your-domain.com/api/subscriptions/status \
  -H "Authorization: Bearer firebase_token"
```

---

## Support & Maintenance

### Common Issues

**Issue:** Subscription not activating after payment
- Check Midtrans webhook logs in dashboard
- Verify webhook URL is correct
- Check `AdminEvent` table for webhook errors
- Verify signature key matches

**Issue:** User can't access premium content
- Check subscription status in database
- Verify `endDate` hasn't expired
- Check `isActive` flag on ebook

**Issue:** Admin can't access dashboard
- Verify user `role` is set to `ADMIN` in database
- Check Firebase token is valid
- Verify admin middleware is applied

---

## Version Information
- Platform: Next.js 16.1.2
- Prisma: Latest
- Firebase Admin: Latest
- PostgreSQL: Compatible with Neon/Supabase
