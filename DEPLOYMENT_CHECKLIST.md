# Production Deployment Checklist

Use this checklist before deploying to production.

## ✅ Pre-Deployment Setup

### 1. Environment Variables
- [ ] All `.env` variables configured correctly
- [ ] `MIDTRANS_IS_PRODUCTION` set to "true"
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Firebase private key properly formatted (with `\n`)
- [ ] Database URLs updated for production
- [ ] `.env` file is in `.gitignore`

### 2. Database
- [ ] PostgreSQL database provisioned (Neon/Supabase/self-hosted)
- [ ] Connection pooling enabled
- [ ] Backup strategy configured
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma migrate deploy` (or `npx prisma db push`)
- [ ] Database connection tested successfully

### 3. Firebase
- [ ] Production Firebase project created
- [ ] Email/Password authentication enabled
- [ ] OAuth providers enabled (if using)
- [ ] Firebase Admin SDK credentials downloaded
- [ ] Client SDK config copied
- [ ] Auth domain whitelisted in Firebase Console

### 4. Midtrans
- [ ] Production account activated
- [ ] Server Key and Client Key copied
- [ ] Webhook notification URL configured:
  - URL: `https://your-domain.com/api/webhooks/midtrans`
  - Test webhook from Midtrans dashboard
- [ ] Payment methods enabled (credit card, bank transfer, etc.)
- [ ] Signature verification tested

### 5. Cloud Storage (for PDFs/Images)
- [ ] Storage bucket created (S3/R2/Firebase Storage)
- [ ] CORS configured for your domain
- [ ] Public read access enabled (or signed URLs configured)
- [ ] Sample files uploaded and tested

---

## 🔒 Security Checklist

### Authentication
- [ ] Firebase token verification working
- [ ] Admin role protection tested
- [ ] Tokens expire correctly (1 hour default)
- [ ] Unauthorized access returns 401
- [ ] Forbidden access returns 403

### API Security
- [ ] All admin routes protected with `withAdmin`
- [ ] All protected routes use `withAuth`
- [ ] Webhook signature verification working
- [ ] No sensitive data in error messages
- [ ] CORS configured correctly
- [ ] Rate limiting implemented (recommended)

### Data Security
- [ ] Database credentials secure
- [ ] Private keys not exposed in client code
- [ ] Subscription validation server-side only
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention in place

---

## 🧪 Testing Checklist

### Authentication Flow
- [ ] User can register via Firebase
- [ ] User syncs with PostgreSQL via `/api/auth/sync`
- [ ] Login returns valid token
- [ ] Token works in API requests
- [ ] Admin users have correct permissions

### Subscription Flow
- [ ] Can create subscription payment
- [ ] Midtrans Snap UI loads correctly
- [ ] Test payment completes successfully
- [ ] Webhook received and processed
- [ ] Subscription activates in database
- [ ] User can access premium content
- [ ] Subscription expiry works correctly

### Admin Dashboard
- [ ] Admin can login
- [ ] Stats load correctly
- [ ] User management works (list, update role, delete)
- [ ] Ebook CRUD operations work
- [ ] Banner CRUD operations work
- [ ] AdminEvent logs created correctly

### Content Access
- [ ] Free ebooks accessible to all
- [ ] Premium ebooks require subscription
- [ ] Non-subscribers see subscription prompt
- [ ] Reading sessions tracked correctly
- [ ] Reading history displays properly

### Error Handling
- [ ] Invalid tokens return proper error
- [ ] Missing data returns 400
- [ ] Unauthorized access returns 401/403
- [ ] Server errors return 500 (without sensitive info)
- [ ] Database errors handled gracefully

---

## 📊 Database Setup

### Initial Admin User
- [ ] Created first admin user (see SETUP.md)
- [ ] Verified admin can access `/admin` routes
- [ ] Tested admin API endpoints

### Sample Data (Optional)
- [ ] Sample ebooks created
- [ ] Sample banners created
- [ ] Categories populated
- [ ] Test subscriptions created

### Database Verification
- [ ] All tables created correctly
- [ ] Indexes applied
- [ ] Relationships working (cascading deletes)
- [ ] Prisma Studio accessible (`npx prisma studio`)

---

## 🚀 Deployment Steps

### Build Verification
```bash
# 1. Clean build
npm run build

# 2. Test production build locally
npm start

# 3. Verify no build errors
# 4. Test critical flows locally
```

### Deploy to Vercel (or other platform)
- [ ] Repository connected
- [ ] Environment variables set in platform
- [ ] Build settings configured:
  - Build command: `npm run build`
  - Output directory: `.next`
- [ ] First deployment successful
- [ ] Domain configured
- [ ] SSL certificate active

### Post-Deployment
- [ ] Update Midtrans webhook URL to production domain
- [ ] Update Firebase authorized domains
- [ ] Update CORS settings if needed
- [ ] Test production deployment:
  - [ ] Homepage loads
  - [ ] Registration works
  - [ ] Login works
  - [ ] Subscription flow works
  - [ ] Admin dashboard works

---

## 📈 Monitoring Setup

### Error Tracking
- [ ] Sentry or similar service configured
- [ ] Error alerts set up
- [ ] Source maps uploaded (for better stack traces)

### Analytics
- [ ] Google Analytics or similar installed
- [ ] Key events tracked:
  - User registrations
  - Subscription purchases
  - Ebook views
  - Reading sessions

### Performance Monitoring
- [ ] API response times monitored
- [ ] Database query performance tracked
- [ ] Webhook processing latency monitored

### Business Metrics
- [ ] Subscription conversion rate
- [ ] Active subscribers count
- [ ] Revenue tracking
- [ ] User engagement metrics

---

## 🔄 Ongoing Maintenance

### Daily
- [ ] Check AdminEvent table for errors
- [ ] Monitor webhook processing
- [ ] Review new user signups
- [ ] Check subscription activations

### Weekly
- [ ] Review error logs
- [ ] Analyze subscription conversion
- [ ] Check database performance
- [ ] Review top-read ebooks

### Monthly
- [ ] Database backup verification
- [ ] Security audit
- [ ] Performance optimization
- [ ] Update dependencies (security patches)

---

## 🆘 Rollback Plan

If deployment fails:

1. **Revert Deployment**
   ```bash
   # Vercel
   vercel rollback
   ```

2. **Database Rollback**
   ```bash
   # If migration fails
   npx prisma migrate resolve --rolled-back [migration-name]
   ```

3. **Check Logs**
   - Application logs
   - Database logs
   - Webhook logs

4. **Emergency Contacts**
   - Database provider support
   - Payment gateway support
   - Hosting platform support

---

## 📝 Documentation

### Internal Documentation
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment process documented
- [ ] Troubleshooting guide created

### External Documentation (if applicable)
- [ ] User guide
- [ ] API documentation for integrations
- [ ] Privacy policy
- [ ] Terms of service

---

## 🎯 Launch Readiness

### Minimum Requirements
- [ ] Core functionality tested
- [ ] Payment processing verified
- [ ] Security measures in place
- [ ] Monitoring configured
- [ ] Backup strategy active

### Nice to Have
- [ ] Email notifications
- [ ] Social sharing
- [ ] Mobile optimization
- [ ] SEO optimization
- [ ] Performance optimization

---

## 🔔 Post-Launch

### First 24 Hours
- [ ] Monitor error rates closely
- [ ] Watch for failed webhooks
- [ ] Track subscription conversions
- [ ] Check database performance
- [ ] Be available for urgent issues

### First Week
- [ ] Analyze user behavior
- [ ] Identify pain points
- [ ] Optimize slow queries
- [ ] Fix critical bugs
- [ ] Gather user feedback

### First Month
- [ ] Review all metrics
- [ ] Plan feature improvements
- [ ] Optimize conversion funnel
- [ ] Scale infrastructure if needed
- [ ] Celebrate successful launch! 🎉

---

## 📞 Emergency Contacts

### Services
- **Database**: [Provider support contact]
- **Hosting**: [Platform support contact]
- **Payment**: [Midtrans support contact]
- **Auth**: [Firebase support]

### Internal
- **Technical Lead**: [Contact info]
- **DevOps**: [Contact info]
- **Business Owner**: [Contact info]

---

## ✅ Final Sign-Off

Before going live:

- [ ] Technical team reviewed and approved
- [ ] Business stakeholders approved
- [ ] Legal/compliance requirements met
- [ ] Customer support prepared
- [ ] Marketing materials ready
- [ ] Launch announcement scheduled

---

**Deployment Date**: ________________

**Deployed By**: ________________

**Sign-Off**: ________________

---

Good luck with your launch! 🚀
