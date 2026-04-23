# Vercel Deployment Guide - Smart Classroom Manager

This guide explains how to deploy the Smart Classroom Manager application to Vercel with full backend integration.

## Prerequisites

- GitHub account with the `attendance-app` repository
- Vercel account (free tier available)
- MySQL/TiDB database (provided by Manus or your own)

## Deployment Steps

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "Add New..." → "Project"
4. Select "Import Git Repository"
5. Search for `Nitya-Choudhary/attendance-app`
6. Click "Import"

### Step 2: Configure Environment Variables

In the Vercel project settings, add the following environment variables:

#### Database Configuration
```
DATABASE_URL=mysql://username:password@host:port/database_name
```

#### Authentication (Manus OAuth)
```
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=your_jwt_secret_key
```

#### API Keys
```
BUILT_IN_FORGE_API_KEY=your_forge_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

#### Application Configuration
```
VITE_APP_TITLE=Smart Classroom Manager
VITE_APP_LOGO=https://your-logo-url.png
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
```

### Step 3: Configure Build Settings

1. **Framework Preset:** Select "Other" (or leave as default)
2. **Build Command:** `pnpm build`
3. **Output Directory:** `dist`
4. **Install Command:** `pnpm install`

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Your app will be available at `https://attendance-app.vercel.app` (or custom domain)

## Backend Deployment

### Option A: Deploy Backend Separately (Recommended)

For production, deploy the backend to a dedicated server:

**Supported Platforms:**
- Railway
- Render
- Heroku
- AWS EC2
- DigitalOcean

**Steps:**
1. Create a new project on your chosen platform
2. Connect the GitHub repository
3. Set the same environment variables
4. Configure build command: `pnpm build`
5. Configure start command: `pnpm start`
6. Update `VITE_FRONTEND_FORGE_API_URL` to your backend URL

### Option B: Deploy Full Stack on Vercel

Vercel supports full-stack applications with serverless functions:

1. The frontend builds to `dist/`
2. The backend runs as serverless functions
3. Both are deployed together

**Note:** This approach has limitations for long-running processes. For production, Option A is recommended.

## Database Setup

### Using Manus Database

If using Manus platform's built-in database:
1. The `DATABASE_URL` is automatically provided
2. Migrations are automatically applied
3. No additional setup needed

### Using External Database

If using your own MySQL/TiDB database:

1. Create a new database
2. Run migrations:
   ```bash
   pnpm drizzle-kit migrate
   ```
3. Set `DATABASE_URL` in environment variables

## Post-Deployment

### 1. Test Authentication
- Navigate to your deployed app
- Click "Login with Manus"
- Verify OAuth flow works

### 2. Test Database Connection
- Create a test assignment
- Verify data is saved to database
- Check attendance marking works

### 3. Test File Uploads
- Submit an assignment with file
- Verify file is uploaded to S3
- Download file from teacher view

### 4. Monitor Logs
- In Vercel dashboard, go to "Deployments" → "Logs"
- Check for any errors
- Monitor API responses

## Troubleshooting

### Build Fails
**Error:** `pnpm: command not found`
- Solution: Ensure Node.js 18+ is installed
- Vercel should auto-detect pnpm

**Error:** `DATABASE_URL is not set`
- Solution: Add `DATABASE_URL` to environment variables
- Verify the connection string is correct

### OAuth Not Working
**Error:** `Invalid redirect URI`
- Solution: Update Manus OAuth app settings
- Add your Vercel deployment URL to allowed redirects
- Format: `https://your-domain.vercel.app/api/oauth/callback`

### Database Connection Timeout
**Error:** `ETIMEDOUT` or `ECONNREFUSED`
- Solution: Check database firewall settings
- Verify `DATABASE_URL` is correct
- Ensure database is accessible from Vercel IPs

### File Upload Fails
**Error:** `S3 upload failed`
- Solution: Verify S3 credentials in environment
- Check S3 bucket permissions
- Ensure `BUILT_IN_FORGE_API_KEY` is valid

## Performance Optimization

1. **Enable Caching**
   - Vercel automatically caches static assets
   - Configure cache headers in `vercel.json`

2. **Database Optimization**
   - Add indexes to frequently queried columns
   - Use connection pooling for better performance

3. **Frontend Optimization**
   - Code splitting is automatic with Vite
   - Images are optimized by Vercel

## Custom Domain

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update OAuth redirect URIs with new domain

## Continuous Deployment

Once connected to GitHub:
- Every push to `main` branch triggers automatic deployment
- Preview deployments for pull requests
- Automatic rollback on failed builds

## Support

For issues with:
- **Vercel:** Visit [vercel.com/support](https://vercel.com/support)
- **GitHub:** Check [GitHub Actions logs](https://github.com/Nitya-Choudhary/attendance-app/actions)
- **Application:** Check logs in Vercel dashboard

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | MySQL/TiDB connection string |
| VITE_APP_ID | Yes | Manus OAuth application ID |
| JWT_SECRET | Yes | Secret key for JWT signing |
| OAUTH_SERVER_URL | Yes | Manus OAuth server URL |
| BUILT_IN_FORGE_API_KEY | Yes | API key for backend services |
| VITE_APP_TITLE | No | Application title |
| VITE_APP_LOGO | No | Application logo URL |

---

**Happy Deploying! 🚀**
