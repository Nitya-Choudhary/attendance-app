# GitHub to Vercel Deployment Guide

## Quick Start

Your Smart Classroom Manager application is now on GitHub and ready to deploy to Vercel!

**GitHub Repository:** https://github.com/Nitya-Choudhary/attendance-app

## One-Click Deployment to Vercel

### Step 1: Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Sign in with GitHub (or create an account)

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Select "Import Git Repository"
3. Search for `attendance-app`
4. Click "Import"

### Step 3: Configure Environment Variables

Vercel will prompt you to add environment variables. Add these:

**Critical Variables (Required):**

```
DATABASE_URL=your_database_connection_string
VITE_APP_ID=your_manus_app_id
JWT_SECRET=your_jwt_secret_key
OAUTH_SERVER_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
```

**Optional Variables:**

```
VITE_APP_TITLE=Smart Classroom Manager
VITE_APP_LOGO=https://your-logo-url.png
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Your app is live! 🎉

**Your app URL:** `https://attendance-app.vercel.app`

---

## Detailed Setup Instructions

### Getting Required Credentials

#### 1. Database URL

**Option A: Using Manus Database**
- If you're using Manus platform, the DATABASE_URL is provided automatically
- Contact Manus support for your connection string

**Option B: Using External Database (MySQL/TiDB)**
```
DATABASE_URL=mysql://username:password@host:port/database_name

Example:
DATABASE_URL=mysql://admin:mypassword@db.example.com:3306/classroom_app
```

#### 2. Manus OAuth Credentials

1. Go to [Manus Dashboard](https://manus.im/dashboard)
2. Navigate to "OAuth Applications"
3. Create a new application:
   - **App Name:** Smart Classroom Manager
   - **Redirect URI:** `https://attendance-app.vercel.app/api/oauth/callback`
4. Copy:
   - `VITE_APP_ID` (Application ID)
   - `JWT_SECRET` (generate a random 32-character string)

#### 3. API Keys

From Manus Dashboard:
- `BUILT_IN_FORGE_API_KEY` - Backend API key
- `VITE_FRONTEND_FORGE_API_KEY` - Frontend API key

---

## Full Deployment Workflow

### Step 1: Push Code to GitHub ✅ (Already Done)

Your code is already on GitHub at:
```
https://github.com/Nitya-Choudhary/attendance-app
```

### Step 2: Connect to Vercel

```bash
# Option A: Use Vercel CLI (if you have it installed)
vercel

# Option B: Use Vercel Web Dashboard (Recommended)
# Go to vercel.com and import the GitHub repository
```

### Step 3: Configure Environment

In Vercel Dashboard:

1. Go to Project Settings → Environment Variables
2. Add all required variables
3. Save

### Step 4: Deploy

```bash
# Automatic: Push to main branch
git push origin main

# Manual: Redeploy from Vercel dashboard
# Click "Deployments" → "..." → "Redeploy"
```

### Step 5: Verify Deployment

1. Visit your deployed app
2. Test login with Manus OAuth
3. Create a test assignment
4. Mark attendance
5. Submit feedback

---

## Troubleshooting Deployment

### Build Fails

**Error:** `Module not found: 'drizzle-orm'`
- Solution: Ensure `pnpm install` runs correctly
- Check `package.json` has all dependencies

**Error:** `DATABASE_URL is required`
- Solution: Add `DATABASE_URL` to environment variables
- Verify format is correct

### OAuth Redirect Error

**Error:** `Invalid redirect URI`
- Solution: Update Manus OAuth app settings
- Add your Vercel URL: `https://attendance-app.vercel.app/api/oauth/callback`

### Database Connection Error

**Error:** `ECONNREFUSED` or `ETIMEDOUT`
- Solution: Check database is accessible from Vercel
- Verify `DATABASE_URL` is correct
- Check firewall allows Vercel IPs

### File Upload Fails

**Error:** `S3 upload failed`
- Solution: Verify S3 credentials in environment
- Check `BUILT_IN_FORGE_API_KEY` is valid

---

## Monitoring & Logs

### View Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Select latest deployment
5. Click "Logs" tab

### Common Log Messages

```
✓ Build completed successfully
✓ Deployed to production
✓ Database migrations applied
```

### Error Logs

```
✗ Database connection failed
✗ OAuth token invalid
✗ S3 upload error
```

---

## Continuous Deployment

Once connected to GitHub, every push triggers automatic deployment:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects the push
# 2. Runs build command
# 3. Deploys to production
# 4. Sends deployment notification
```

---

## Custom Domain

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration
4. Update Manus OAuth redirect URI

---

## Performance Tips

1. **Enable Caching**
   - Vercel automatically caches static assets
   - API responses are not cached

2. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling

3. **Monitor Performance**
   - Vercel Analytics shows real-time metrics
   - Check "Deployments" for build times

---

## Rollback to Previous Version

If something breaks:

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"
4. Your app reverts to that version

---

## Environment Variables Checklist

- [ ] DATABASE_URL
- [ ] VITE_APP_ID
- [ ] JWT_SECRET
- [ ] OAUTH_SERVER_URL
- [ ] BUILT_IN_FORGE_API_KEY
- [ ] BUILT_IN_FORGE_API_URL
- [ ] VITE_FRONTEND_FORGE_API_KEY
- [ ] VITE_FRONTEND_FORGE_API_URL
- [ ] VITE_OAUTH_PORTAL_URL

---

## Next Steps

1. **Deploy to Vercel** (5 minutes)
2. **Test all features** (10 minutes)
3. **Set up custom domain** (optional)
4. **Enable monitoring** (optional)
5. **Share with users** 🎉

---

## Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **GitHub Actions:** https://github.com/Nitya-Choudhary/attendance-app/actions
- **Manus Support:** https://help.manus.im

---

**Ready to deploy? Go to [vercel.com](https://vercel.com) now!** 🚀
