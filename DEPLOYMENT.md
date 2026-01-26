# 🚀 Pre-Deployment Checklist

## ✅ Before Your First Public Deploy

### 1. Environment Configuration
- [ ] `.env.local` exists and contains all required variables
- [ ] `.env.local` is listed in `.gitignore`
- [ ] `.env.example` has placeholders (no real secrets)
- [ ] No `NEXT_PUBLIC_` prefix on `SUPABASE_SERVICE_ROLE_KEY`

### 2. Secret Scanning
Run these commands and ensure they pass:
```bash
# Automated secret scan
npm run check-secrets

# Check git history
git log --all --full-history -p | grep -E "eyJ[A-Za-z0-9_-]{40,}" | head -20

# Verify .env.local not committed
git log --all --full-history --name-only | grep "\.env\.local"
```

Expected results:
- [ ] `npm run check-secrets` → ✅ No secrets detected
- [ ] Git history check → No JWT tokens found
- [ ] `.env.local` → Not in git history

### 3. Code Security Review
- [ ] No hardcoded API keys in source code
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only used in `/app/api/*` routes
- [ ] All API routes have authentication checks
- [ ] Client components call API routes (not direct admin client)

Quick verification:
```bash
# Should return ONLY app/api/admin/users/route.ts
grep -r "SUPABASE_SERVICE_ROLE_KEY" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" app/
```

### 4. Supabase Configuration
- [ ] RLS (Row Level Security) enabled on all tables
- [ ] Storage bucket policies configured
- [ ] Auth policies tested and working
- [ ] Admin user created (`admin@admin.com`)

Verify in Supabase Dashboard:
```sql
-- Run in SQL Editor
-- All tables should show 'true'
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### 5. Build Test
```bash
# Must succeed without errors
npm run build

# Check for build warnings about env vars
# Should see NEXT_PUBLIC_* vars only in output
```

- [ ] Build completes successfully
- [ ] No environment variable warnings
- [ ] Bundle size reasonable (check `.next/static`)

### 6. Vercel Setup
Log in to [Vercel Dashboard](https://vercel.com):

1. **Create New Project**
   - [ ] Import Git repository
   - [ ] Framework Preset: Next.js (auto-detected)
   - [ ] Root Directory: `./` (default)

2. **Environment Variables**
   Add these in Project Settings → Environment Variables:
   
   | Variable | Value | Environment |
   |----------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJxxx...` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJxxx...` (⚠️ SECRET!) | Production only |

   - [ ] All variables added
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` set to Production ONLY
   - [ ] Values copied correctly (no extra spaces)

3. **Domains**
   - [ ] Custom domain configured (optional)
   - [ ] HTTPS enabled (automatic)

### 7. Post-Deployment Verification

After first deploy:

1. **Basic Functionality**
   - [ ] Homepage loads: `https://your-project.vercel.app`
   - [ ] No console errors in browser DevTools
   - [ ] Images load correctly
   - [ ] Navigation works

2. **Authentication**
   - [ ] Login page accessible
   - [ ] Registration works
   - [ ] Password reset flow works
   - [ ] Logout works

3. **Admin Panel**
   - [ ] `/admin` requires authentication
   - [ ] Non-admin users get 403/unauthorized
   - [ ] Admin can access dashboard
   - [ ] API routes return data

4. **API Routes**
   Test each endpoint:
   ```bash
   # Replace YOUR_DOMAIN with your Vercel URL
   curl https://YOUR_DOMAIN.vercel.app/api/admin/users
   # Should return 401 Unauthorized (good!)
   
   # With valid auth token (get from browser DevTools → Application → Cookies)
   curl https://YOUR_DOMAIN.vercel.app/api/admin/users \
     -H "Authorization: Bearer YOUR_TOKEN"
   # Should return user list (if admin)
   ```

   - [ ] Unauthenticated requests blocked
   - [ ] Authenticated requests work
   - [ ] Admin-only routes enforce admin check

5. **Security Checks**
   ```bash
   # Check if secrets exposed in client bundle
   curl -s https://YOUR_DOMAIN.vercel.app/_next/static/chunks/*.js | grep -i "service_role"
   # Should return NOTHING
   ```

   - [ ] No secrets in client JavaScript bundles
   - [ ] HTTPS enforced (no HTTP)
   - [ ] Security headers present:
     ```bash
     curl -I https://YOUR_DOMAIN.vercel.app
     # Check for: X-Frame-Options, X-Content-Type-Options, etc.
     ```

### 8. Monitoring & Maintenance

Set up ongoing monitoring:

1. **Vercel Analytics**
   - [ ] Enable in Project Settings → Analytics
   - [ ] Monitor errors and performance

2. **Supabase Logs**
   - [ ] Check Database → Logs for errors
   - [ ] Review API → Logs for rate limits
   - [ ] Set up alerts (optional)

3. **Scheduled Tasks**
   - [ ] Rotate service role key every 90 days
   - [ ] Review access logs monthly
   - [ ] Update dependencies quarterly

### 9. Documentation
- [ ] README.md has setup instructions
- [ ] SECURITY.md reviewed by team
- [ ] API documentation up to date (if applicable)
- [ ] Deployment runbook created

### 10. Team Handoff
- [ ] All team members have Vercel access
- [ ] Supabase credentials shared securely (password manager)
- [ ] On-call rotation defined (if applicable)
- [ ] Incident response plan documented

---

## 🚨 Final Pre-Flight Check

Run all these commands **in order**:

```bash
# 1. Clean install
rm -rf node_modules .next
npm install

# 2. Run linter
npm run lint

# 3. Check for secrets
npm run check-secrets

# 4. Build for production
npm run build

# 5. Test production build locally
npm run start
# Open http://localhost:3000 and test manually
```

✅ **All checks passed?** You're ready to deploy!

```bash
# Push to main branch (if using Git)
git push origin main

# Vercel will auto-deploy
# Or manually: vercel --prod
```

---

## 📋 Quick Reference Commands

```bash
# Local development
npm run dev

# Check for secrets before commit
npm run check-secrets

# Production build test
npm run build && npm run start

# Deploy to Vercel (manual)
npx vercel --prod

# View deployment logs
npx vercel logs YOUR_DEPLOYMENT_URL
```

---

## 🆘 Troubleshooting

### "Environment variable not defined"
- Check Vercel dashboard: Project Settings → Environment Variables
- Ensure variable is set for correct environment (Production/Preview/Development)
- Redeploy after adding variables

### "Authentication not working"
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase dashboard: Settings → API → Check if keys match
- Clear browser cache and cookies

### "Admin panel shows 403"
- Confirm user is logged in as `admin@admin.com`
- Check API route auth logic in `app/api/admin/*/route.ts`
- Review Supabase user metadata: `user_metadata.role === 'admin'`

### "Build fails on Vercel"
- Check build logs in Vercel dashboard
- Ensure all dependencies in `package.json`
- Verify TypeScript errors: `npm run build` locally
- Check Node.js version compatibility

---

## ✅ Success Criteria

You can consider deployment successful when:

1. ✅ All automated checks pass (secrets scan, build)
2. ✅ Application loads on Vercel URL
3. ✅ Authentication flow works end-to-end
4. ✅ Admin panel restricted to authorized users
5. ✅ No secrets in client-side code
6. ✅ HTTPS enforced and working
7. ✅ No errors in Vercel logs for 24 hours
8. ✅ Team can access and verify functionality

---

**Last Updated:** January 26, 2026
**Next Review:** Before next major deployment
