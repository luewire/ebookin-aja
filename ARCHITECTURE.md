# Architecture Overview - EbookIn Platform

## System Design Philosophy

This platform is designed with these core principles:
1. **Stability First**: Production-ready code with proper error handling
2. **Clear Separation**: Firebase for auth only, PostgreSQL for all data
3. **No Vendor Lock-in**: Can migrate from Firebase/Midtrans if needed
4. **Scalability**: Efficient queries, proper indexes, stateless APIs
5. **Security**: Server-side validation, role-based access control

---

## Technology Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes** (App Router)
- **PostgreSQL** (Neon/Supabase/Self-hosted)
- **Prisma ORM**

### Authentication
- **Firebase Authentication** (Email/Password + OAuth)
- **Firebase Admin SDK** (Server-side token verification)

### Payments
- **Midtrans** (Sandbox and Production)
- Webhook-based subscription activation

### Storage
- Cloud storage URLs (S3/R2/Firebase Storage)
- No direct file storage in database

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  - Next.js Pages (React Components)                     │
│  - Firebase Auth SDK (Login/Register)                   │
│  - Midtrans Snap (Payment UI)                           │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTPS + Bearer Token
                     │
┌────────────────────▼────────────────────────────────────┐
│              NEXT.JS API ROUTES (App Router)            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                 │  │
│  │  - withAuth() - Verifies Firebase token          │  │
│  │  - withAdmin() - Checks role === ADMIN           │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐  │
│  │  Business Logic                                   │  │
│  │  - Subscription management                        │  │
│  │  - Access control (premium content)               │  │
│  │  - Reading session tracking                       │  │
│  │  - Admin operations (CRUD)                        │  │
│  └────────────────┬─────────────────────────────────┘  │
│                   │                                      │
│  ┌────────────────▼─────────────────────────────────┐  │
│  │  Data Layer (Prisma)                              │  │
│  │  - Query builder                                  │  │
│  │  - Type safety                                    │  │
│  │  - Transaction support                            │  │
│  └────────────────┬─────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────┘
                    │
        ┌───────────┴────────────┐
        │                        │
┌───────▼────────┐      ┌───────▼────────┐
│   PostgreSQL   │      │  Firebase Auth │
│   (Primary DB) │      │   (Auth Only)  │
│                │      │                │
│  - Users       │      │  - Verify      │
│  - Subs        │      │    tokens      │
│  - Ebooks      │      │  - No data     │
│  - Banners     │      │    storage     │
│  - Logs        │      └────────────────┘
└────────────────┘

┌────────────────────────────────────────┐
│         External Services              │
│                                        │
│  Midtrans Payment Gateway              │
│  ├─ Create Transaction                │
│  ├─ Snap Token Generation              │
│  └─ Webhook Notifications ────────┐   │
│                                    │   │
│  POST /api/webhooks/midtrans ◄────┘   │
└────────────────────────────────────────┘
```

---

## Data Flow Patterns

### 1. User Registration & Login

```
┌──────┐     1. Sign Up/Login      ┌───────────────┐
│Client├─────────────────────────►│ Firebase Auth │
└───┬──┘                           └───────┬───────┘
    │                                      │
    │     2. ID Token                      │
    │◄─────────────────────────────────────┘
    │
    │     3. POST /api/auth/sync
    │        { idToken, name }
    ├─────────────────────────────────┐
    │                                  │
    │                           ┌──────▼──────┐
    │                           │ API Route   │
    │                           │ - Verify    │
    │                           │   token     │
    │                           │ - Upsert    │
    │                           │   user in   │
    │                           │   Postgres  │
    │                           └──────┬──────┘
    │                                  │
    │     4. User data                 │
    │◄─────────────────────────────────┘
    │
    │  Store token locally
    │  Include in all API requests
    └───────────────────────────────────►
```

### 2. Subscription Purchase Flow

```
┌──────┐                              ┌──────────┐
│Client│                              │PostgreSQL│
└───┬──┘                              └─────┬────┘
    │                                       │
    │ 1. POST /api/subscriptions/create    │
    │    { planName: "1month" }            │
    ├──────────────────────────┐           │
    │                           │           │
    │                    ┌──────▼──────┐   │
    │                    │ API Route   │   │
    │                    │ - Verify    │   │
    │                    │   auth      │   │
    │                    │ - Check     │   │
    │                    │   existing  │◄──┤
    │                    │ - Create    │   │
    │                    │   order     ├──►│
    │                    └──────┬──────┘   │
    │                           │           │
    │                    ┌──────▼──────┐   │
    │                    │  Midtrans   │   │
    │                    │  API        │   │
    │                    │ - Create    │   │
    │                    │   Snap      │   │
    │                    │   token     │   │
    │                    └──────┬──────┘   │
    │                           │           │
    │ 2. Snap token            │           │
    │◄──────────────────────────┘           │
    │                                       │
    │ 3. Show Midtrans UI                  │
    │    User completes payment            │
    │                                       │
    │                                       │
┌───▼────────┐                             │
│  Midtrans  │                             │
│  processes │                             │
│  payment   │                             │
└───┬────────┘                             │
    │                                       │
    │ 4. Webhook: POST /webhooks/midtrans  │
    ├──────────────────────────┐           │
    │                           │           │
    │                    ┌──────▼──────┐   │
    │                    │ Webhook     │   │
    │                    │ Handler     │   │
    │                    │ - Verify    │   │
    │                    │   signature │   │
    │                    │ - Activate  │   │
    │                    │   sub       ├──►│
    │                    │ - Create    │   │
    │                    │   event     ├──►│
    │                    └─────────────┘   │
    │                                       │
    │ 5. Client checks status              │
    │    GET /api/subscriptions/status     │
    │◄──────────────────────────────────────┤
```

### 3. Premium Content Access

```
┌──────┐                              ┌──────────┐
│Client│                              │PostgreSQL│
└───┬──┘                              └─────┬────┘
    │                                       │
    │ 1. GET /api/ebooks/[id]              │
    │    Authorization: Bearer token       │
    ├──────────────────────────┐           │
    │                           │           │
    │                    ┌──────▼──────┐   │
    │                    │ API Route   │   │
    │                    │ - Verify    │   │
    │                    │   auth      │   │
    │                    │ - Get ebook │◄──┤
    │                    └──────┬──────┘   │
    │                           │           │
    │                           │ isPremium?
    │                           │           │
    │                    ┌──────▼──────┐   │
    │                    │ Check       │   │
    │                    │ Subscription│◄──┤
    │                    │ - Query DB  │   │
    │                    │ - Validate  │   │
    │                    │   status    │   │
    │                    │ - Check     │   │
    │                    │   expiry    │   │
    │                    └──────┬──────┘   │
    │                           │           │
    │                           │ Has access?
    │                           │           │
    │ 2a. Access granted               │
    │    { ebook with pdfUrl }             │
    │◄──────────────────────────┘           │
    │                                       │
    │ OR                                    │
    │                                       │
    │ 2b. Access denied                    │
    │    { requiresSubscription: true }    │
    │◄──────────────────────────────────────┘
```

---

## Database Schema Design

### Core Principles
1. **User as Central Entity**: All data ties back to User
2. **Cascading Deletes**: Clean up related data automatically
3. **Indexes**: Optimize common queries
4. **Audit Trail**: AdminEvent logs all important actions

### Relationships

```
User (1) ───────────────────► (1) Subscription
  │                                  │
  │                                  │
  │                                  ▼
  │                            Transaction (N)
  │
  ├──────────────────────────► ReadingLog (N)
  │                                  │
  │                                  │
  │                                  ▼
  └──────────────────────────► Ebook (1)

Ebook (standalone)
Banner (standalone)
AdminEvent (standalone audit log)
```

### Key Design Decisions

**1. Subscription per User (1:1)**
- One active subscription per user
- Upsert pattern for renewals
- Auto-expiry via endDate check

**2. Transaction History (1:N)**
- Keep all transaction records
- Audit trail for payments
- Webhook payload stored as JSON

**3. Reading Logs (Unique per User-Ebook)**
- Track user engagement
- `lastReadAt` for active sessions
- Unique constraint prevents duplicates

**4. Admin Events**
- System-wide audit log
- Searchable by type and date
- JSON metadata for flexibility

---

## Security Architecture

### Authentication Layer

```
┌────────────────────────────────────────┐
│  Request: Authorization: Bearer <token>│
└────────────────┬───────────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │ withAuth()      │
       │ middleware      │
       └────────┬────────┘
                │
                ▼
    ┌───────────────────────┐
    │ Firebase Admin SDK    │
    │ verifyIdToken()       │
    └───────────┬───────────┘
                │
                ▼ Valid?
            Yes │ No
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌─────────┐
│ Fetch user    │  │ 401     │
│ from Postgres │  │ Reject  │
└───────┬───────┘  └─────────┘
        │
        ▼
┌───────────────┐
│ Attach user   │
│ to request    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Call handler  │
└───────────────┘
```

### Admin Protection

```
┌────────────────────────────────────────┐
│  Request to /api/admin/*               │
└────────────────┬───────────────────────┘
                 │
                 ▼
       ┌─────────────────┐
       │ withAdmin()     │
       │ middleware      │
       └────────┬────────┘
                │
                ▼
       ┌─────────────────┐
       │ Calls withAuth()│
       │ first           │
       └────────┬────────┘
                │
                ▼ Authenticated?
            Yes │ No
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌─────────┐
│ Check role    │  │ 401     │
│ === ADMIN     │  │ Reject  │
└───────┬───────┘  └─────────┘
        │
        ▼ Is Admin?
    Yes │ No
┌───────┴────────┐
│                │
▼                ▼
Handler      ┌─────────┐
Execute      │ 403     │
             │ Reject  │
             └─────────┘
```

### Webhook Security

```
┌────────────────────────────────────────┐
│  Midtrans Webhook Request              │
│  POST /api/webhooks/midtrans           │
└────────────────┬───────────────────────┘
                 │
                 ▼
       ┌─────────────────────┐
       │ Extract payload      │
       │ - order_id           │
       │ - status_code        │
       │ - gross_amount       │
       │ - signature_key      │
       └────────┬────────────┘
                │
                ▼
       ┌─────────────────────┐
       │ Compute SHA512       │
       │ hash(orderId +       │
       │   statusCode +       │
       │   grossAmount +      │
       │   serverKey)         │
       └────────┬────────────┘
                │
                ▼ Match?
            Yes │ No
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌───────────────┐  ┌─────────┐
│ Process       │  │ 403     │
│ webhook       │  │ Invalid │
└───────────────┘  └─────────┘
```

---

## Performance Optimizations

### Database Indexes

```sql
-- User lookups (frequent)
CREATE INDEX idx_user_firebase ON User(firebaseUid);
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_role ON User(role);

-- Subscription queries
CREATE INDEX idx_subscription_user ON Subscription(userId);
CREATE INDEX idx_subscription_status ON Subscription(status);
CREATE INDEX idx_subscription_enddate ON Subscription(endDate);

-- Ebook searches
CREATE INDEX idx_ebook_active ON Ebook(isActive);
CREATE INDEX idx_ebook_premium ON Ebook(isPremium);
CREATE INDEX idx_ebook_category ON Ebook(category);
CREATE INDEX idx_ebook_priority ON Ebook(priority);

-- Reading session analytics
CREATE INDEX idx_readinglog_lastread ON ReadingLog(lastReadAt);

-- Admin event filtering
CREATE INDEX idx_adminevent_type ON AdminEvent(type);
CREATE INDEX idx_adminevent_created ON AdminEvent(createdAt);
```

### Query Patterns

**Good: Parallel queries for dashboard stats**
```typescript
const [users, subscribers, ebooks, revenue] = await Promise.all([
  prisma.user.count(),
  prisma.subscription.count({ where: { status: 'ACTIVE' } }),
  prisma.ebook.count(),
  prisma.transaction.aggregate({ _sum: { grossAmount: true } }),
]);
```

**Good: Selective field queries**
```typescript
const ebooks = await prisma.ebook.findMany({
  select: {
    id: true,
    title: true,
    coverUrl: true,
    // Don't fetch pdfUrl for list views
  },
});
```

**Avoid: N+1 queries**
```typescript
// Bad
for (const user of users) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id }
  });
}

// Good
const users = await prisma.user.findMany({
  include: { subscription: true }
});
```

---

## Error Handling Strategy

### API Response Standards

```typescript
// Success
{
  "data": { ... },
  "pagination": { ... } // if applicable
}

// Client Error (4xx)
{
  "error": "User-friendly message",
  "code": "SUBSCRIPTION_REQUIRED" // optional
}

// Server Error (5xx)
{
  "error": "Internal server error",
  // Never expose stack traces or internal details
}
```

### Logging Strategy

```typescript
// Server-side only
console.error('[Context] Error:', error);
// Log to external service (Sentry, LogRocket, etc.)

// Return to client
return NextResponse.json(
  { error: 'Failed to process request' },
  { status: 500 }
);
```

---

## Scalability Considerations

### Current Architecture Supports:
- **10K+ users**: Indexed queries, efficient data model
- **1K+ concurrent reads**: Stateless API, cacheable responses
- **100+ transactions/hour**: Webhook processing, transaction isolation

### Future Scaling Options:
1. **Caching Layer**: Redis for subscription status, ebook metadata
2. **CDN**: Static assets (covers, banners)
3. **Read Replicas**: Separate read/write databases
4. **Job Queue**: Background processing for analytics
5. **Microservices**: Separate payment service if needed

### Monitoring Points:
- Database connection pool usage
- API response times (P95, P99)
- Webhook processing latency
- Subscription activation rate
- Active reading sessions trend

---

## Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────────────────┐
│  Vercel / Netlify / Custom                  │
│  - Next.js Application                      │
│  - API Routes                               │
│  - Static Assets                            │
│  - Edge Functions (Middleware)              │
└──────────────┬──────────────────────────────┘
               │
               ├─────────► PostgreSQL (Neon/Supabase)
               │            - Pooled connection
               │            - Direct URL for migrations
               │
               ├─────────► Firebase (Auth only)
               │            - No data storage
               │
               ├─────────► Midtrans API
               │            - Payment processing
               │            - Webhook callback
               │
               └─────────► Cloud Storage (S3/R2)
                           - Ebook PDFs
                           - Cover images
```

### Environment Separation

**Development:**
- Midtrans Sandbox
- Local/Dev PostgreSQL
- Firebase Dev project

**Staging:**
- Midtrans Sandbox
- Staging PostgreSQL
- Firebase Prod (separate app)

**Production:**
- Midtrans Production
- Production PostgreSQL (backups!)
- Firebase Production
- Monitoring & Alerts

---

## Migration Strategy

### From Current State

If migrating from Supabase:
1. Keep Firebase Auth (unchanged)
2. Migrate user data to PostgreSQL
3. Update API routes to use Prisma
4. Test authentication flow
5. Deploy and monitor

### Future Migrations

**Database:** Prisma makes it easy to migrate providers
**Auth:** User table stores firebaseUid, can add other auth methods
**Payments:** Webhook pattern is provider-agnostic

---

## Maintenance Tasks

### Daily:
- Monitor AdminEvent table for errors
- Check webhook processing
- Review subscription activations

### Weekly:
- Analyze subscription conversion rates
- Review top-read ebooks
- Check for expired subscriptions

### Monthly:
- Database performance review
- Security audit (tokens, roles)
- Backup verification
- Revenue reporting

---

## Testing Strategy

### Unit Tests:
- Subscription logic (calculateEndDate, etc.)
- Signature verification
- Access control checks

### Integration Tests:
- Full auth flow
- Subscription purchase flow
- Webhook processing
- Admin operations

### E2E Tests:
- User registration → subscription → access content
- Admin CRUD operations
- Payment failure scenarios

---

This architecture provides a solid foundation for a production SaaS application while maintaining flexibility for future growth and changes.
