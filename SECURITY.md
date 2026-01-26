# 🔒 Security Guide

## Environment Variables & Secrets Management

### ⚠️ CRITICAL SECURITY RULES

1. **NEVER commit secrets to git**
   - Service role keys
   - Database passwords
   - API tokens
   - Private keys

2. **Use `NEXT_PUBLIC_` prefix ONLY for safe values**
   - ✅ Safe: `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ Safe: `NEXT_PUBLIC_SUPABASE_ANON_KEY` (protected by RLS)
   - ❌ NEVER: `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`

3. **Server-side secrets stay server-side**
   - Use only in `/app/api/*` routes
   - Never import in client components
   - Access via `process.env.*` (without `NEXT_PUBLIC_`)

---

## 📋 Variable Classification

### Client-Side Variables (Safe to Expose)
These have `NEXT_PUBLIC_` prefix and are bundled into client JavaScript:

```env
# Supabase Project URL (public)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Anon Key (public, protected by RLS policies)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# Optional: Publishable keys
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_xxx
```

**Why these are safe:**
- Supabase URL is public by design
- Anon key is protected by Row Level Security (RLS) policies
- Both are designed to be used in browsers

### Server-Side Variables (MUST STAY SECRET)
These have NO `NEXT_PUBLIC_` prefix and are only available on the server:

```env
# Service Role Key (ADMIN - bypasses RLS!)
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Database credentials (if needed)
SUPABASE_DB_URL=postgresql://postgres:password@...
```

**Why these are dangerous:**
- Service role bypasses ALL RLS policies
- Full database access
- Can read/write/delete any data
- Can manage users and permissions

---

## 🛡️ Proper Usage Patterns

### ✅ CORRECT: Service Role in API Route
```typescript
// app/api/admin/users/route.ts
import { createClient } from '@supabase/supabase-js';

// Server-side only - safe!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // No NEXT_PUBLIC_!
);

export async function GET() {
  // This runs on the server only
  const { data } = await supabaseAdmin.auth.admin.listUsers();
  return Response.json(data);
}
```

### ❌ WRONG: Service Role in Component
```typescript
// components/AdminPanel.tsx
import { createClient } from '@supabase/supabase-js';

// DANGER! This exposes service role to all website visitors!
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY! // ❌ NEVER DO THIS!
);
```

### ✅ CORRECT: Call API Route from Client
```typescript
// components/AdminPanel.tsx
'use client';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Call our secure API route
    fetch('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${sessionToken}`
      }
    })
    .then(res => res.json())
    .then(setUsers);
  }, []);
  
  return <div>{/* Render users */}</div>;
}
```

---

## 🚀 Deployment Checklist

### Before Deploying to Vercel

- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Confirm no secrets in git history: `git log -p | grep -i service_role`
- [ ] Run secret scanner: `npm run check-secrets`
- [ ] Test build: `npm run build`
- [ ] Review API routes for proper auth checks

### In Vercel Dashboard

1. Go to **Project Settings → Environment Variables**
2. Add each variable:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
3. Set environment scope:
   - Production: ✅
   - Preview: ✅ (optional)
   - Development: ✅ (optional)
4. Click **Save**

### After First Deploy

- [ ] Test public pages load correctly
- [ ] Test API routes work
- [ ] Verify RLS policies are enforced
- [ ] Check browser console for errors
- [ ] Test authentication flow
- [ ] Confirm admin panel requires login

---

## 🔍 Automated Security Checks

### Pre-Commit Hook
Automatically scans staged files before commit:
```bash
# Installed at .husky/pre-commit
# Blocks commits with secrets
git commit -m "feat: add feature"
# → Runs secret scan automatically
```

### GitHub Actions CI
Scans entire codebase on push/PR:
- Workflow: `.github/workflows/secret-scanner.yml`
- Fails CI if secrets detected
- Provides remediation steps

### Manual Scan
Run anytime:
```bash
npm run check-secrets
```

---

## 🆘 Emergency Response

### If Secrets Are Exposed

1. **IMMEDIATELY rotate credentials:**
   - Go to Supabase Dashboard → Settings → API
   - Click **Reset** next to Service Role Key
   - Update `.env.local` with new key
   - Update Vercel environment variables

2. **Check git history:**
   ```bash
   git log -p | grep -i "service_role"
   git log -p | grep -E "eyJ[A-Za-z0-9_-]{40,}"
   ```

3. **Remove from history (if found):**
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # Contact security team if public repo
   ```

4. **Review access logs:**
   - Check Supabase logs for suspicious activity
   - Review API usage patterns

---

## 📚 Best Practices

### Development
- Copy `.env.example` to `.env.local` for local dev
- Never share `.env.local` via Slack/email/screenshots
- Use different keys for dev/staging/production
- Keep `.env.local` out of Docker images

### Code Reviews
- Verify no `NEXT_PUBLIC_` prefix on secrets
- Check API routes have auth guards
- Ensure RLS policies are enabled
- Look for hardcoded tokens

### CI/CD
- Use Vercel's encrypted environment variables
- Never store secrets in workflow files
- Use secrets scanning in CI pipeline
- Rotate keys periodically (every 90 days)

---

## 📖 Additional Resources

- [Supabase Security Docs](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [OWASP API Security](https://owasp.org/www-project-api-security/)

---

## 🔐 Security Contact

For security concerns:
- Review this document first
- Check [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Consult team lead before public disclosure
