# Environment Variables Setup Guide

This guide explains how to configure all environment variables for the Smart Classroom Manager application.

## Quick Reference

| Variable | Required | Type | Description |
|----------|----------|------|-------------|
| DATABASE_URL | ✅ Yes | String | Database connection string |
| VITE_APP_ID | ✅ Yes | String | Manus OAuth application ID |
| JWT_SECRET | ✅ Yes | String | JWT signing secret (min 32 chars) |
| OAUTH_SERVER_URL | ✅ Yes | URL | Manus OAuth server URL |
| BUILT_IN_FORGE_API_KEY | ✅ Yes | String | Backend API key |
| BUILT_IN_FORGE_API_URL | ✅ Yes | URL | Backend API URL |
| VITE_FRONTEND_FORGE_API_KEY | ✅ Yes | String | Frontend API key |
| VITE_FRONTEND_FORGE_API_URL | ✅ Yes | URL | Frontend API URL |
| VITE_OAUTH_PORTAL_URL | ✅ Yes | URL | OAuth portal URL |
| VITE_APP_TITLE | ❌ No | String | Application title |
| VITE_APP_LOGO | ❌ No | URL | Application logo URL |
| OWNER_NAME | ❌ No | String | Owner's name |
| OWNER_OPEN_ID | ❌ No | String | Owner's Manus OpenID |

## Detailed Setup

### 1. Database Configuration

#### Option A: MySQL/TiDB (Recommended for Production)

```
DATABASE_URL=mysql://username:password@host:port/database_name
```

**Example:**
```
DATABASE_URL=mysql://admin:MyPassword123@db.example.com:3306/classroom_app
```

**Components:**
- `username` - Database user
- `password` - Database password
- `host` - Database server hostname
- `port` - Database port (default: 3306)
- `database_name` - Database name

#### Option B: PostgreSQL

```
DATABASE_URL=postgresql://username:password@host:port/database_name
```

#### Option C: Manus Provided Database

If using Manus platform:
- Contact Manus support for your DATABASE_URL
- It will be provided in your project dashboard

### 2. Manus OAuth Setup

#### Step 1: Get Manus Credentials

1. Go to [Manus Dashboard](https://manus.im/dashboard)
2. Navigate to "OAuth Applications"
3. Create a new application:
   - **App Name:** Smart Classroom Manager
   - **Redirect URI:** 
     - Local: `http://localhost:3000/api/oauth/callback`
     - Production: `https://your-domain.vercel.app/api/oauth/callback`

#### Step 2: Configure Variables

```
VITE_APP_ID=your_app_id_from_dashboard
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
JWT_SECRET=generate_random_32_char_string
```

**Generate JWT_SECRET:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))

# Or use online generator: https://www.uuidgenerator.net/
```

### 3. Manus API Keys

From your Manus Dashboard:

```
BUILT_IN_FORGE_API_KEY=your_backend_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

### 4. Application Configuration (Optional)

```
VITE_APP_TITLE=Smart Classroom Manager
VITE_APP_LOGO=https://your-logo-url.png
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_manus_open_id
```

## Local Development Setup

### Using .env File

1. Create `.env` file in project root:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your values:
```
DATABASE_URL=mysql://root:password@localhost:3306/attendance_app
VITE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret
# ... other variables
```

3. Start development server:
```bash
pnpm dev
```

### Using Environment Variables

```bash
# Export variables before running
export DATABASE_URL="mysql://root:password@localhost:3306/attendance_app"
export VITE_APP_ID="your_app_id"
export JWT_SECRET="your_jwt_secret"

pnpm dev
```

## Production Deployment (Vercel)

### Step 1: Add Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable:

| Variable | Value |
|----------|-------|
| DATABASE_URL | Your production database URL |
| VITE_APP_ID | Your Manus app ID |
| JWT_SECRET | Your JWT secret (min 32 chars) |
| OAUTH_SERVER_URL | https://api.manus.im |
| BUILT_IN_FORGE_API_KEY | Your API key |
| BUILT_IN_FORGE_API_URL | https://api.manus.im |
| VITE_FRONTEND_FORGE_API_KEY | Your frontend API key |
| VITE_FRONTEND_FORGE_API_URL | https://api.manus.im |
| VITE_OAUTH_PORTAL_URL | https://oauth.manus.im |

### Step 2: Update OAuth Redirect URI

In Manus Dashboard, update your OAuth app:
- **Redirect URI:** `https://your-domain.vercel.app/api/oauth/callback`

### Step 3: Deploy

```bash
git push origin main
```

Vercel will automatically deploy with the configured environment variables.

## Environment-Specific Configuration

### Development
```
DATABASE_URL=mysql://root:password@localhost:3306/attendance_app_dev
VITE_APP_ID=dev_app_id
JWT_SECRET=dev_jwt_secret
```

### Staging
```
DATABASE_URL=mysql://user:password@staging-db.example.com:3306/attendance_app_staging
VITE_APP_ID=staging_app_id
JWT_SECRET=staging_jwt_secret
```

### Production
```
DATABASE_URL=mysql://user:password@prod-db.example.com:3306/attendance_app_prod
VITE_APP_ID=prod_app_id
JWT_SECRET=prod_jwt_secret_min_32_chars
```

## Verification

### Test Database Connection

```bash
# In your project directory
pnpm dev

# Check logs for:
# ✓ Database connected
# ✓ Server running on http://localhost:3000
```

### Test OAuth

1. Go to http://localhost:3000
2. Click "Login with Manus"
3. You should be redirected to Manus login
4. After login, you should be redirected back to your app

### Test API

```bash
# Check if API is working
curl http://localhost:3000/api/trpc/auth.me

# Should return user data if authenticated
```

## Troubleshooting

### Database Connection Failed

**Error:** `ECONNREFUSED` or `ETIMEDOUT`

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check database server is running
3. Verify username/password are correct
4. Check firewall allows connections

### OAuth Not Working

**Error:** `Invalid redirect URI`

**Solutions:**
1. Update Manus OAuth app settings
2. Add correct redirect URI for your environment
3. Clear browser cookies and try again

### API Key Invalid

**Error:** `Unauthorized` or `Invalid API key`

**Solutions:**
1. Verify API key is correct
2. Check API key hasn't expired
3. Regenerate API key in Manus Dashboard

### Missing Environment Variable

**Error:** `Error: DATABASE_URL is required`

**Solutions:**
1. Check .env file exists
2. Verify variable name is spelled correctly
3. Restart development server after adding variable

## Security Best Practices

1. **Never commit .env file to Git**
   - Add to .gitignore
   - Use environment variables in production

2. **Use strong JWT_SECRET**
   - Minimum 32 characters
   - Use random generator
   - Different for each environment

3. **Rotate API Keys Regularly**
   - Change keys every 90 days
   - Use key versioning
   - Monitor key usage

4. **Use HTTPS in Production**
   - Enable SSL/TLS
   - Update OAuth redirect URI to https://

5. **Restrict Database Access**
   - Use firewall rules
   - Limit to application server IP
   - Use read-only credentials where possible

## Support

For issues with:
- **Manus Credentials:** https://help.manus.im
- **Database Setup:** Check your database provider's documentation
- **Vercel Deployment:** https://vercel.com/support

---

**Need help? Check the deployment guides:**
- [GITHUB_DEPLOYMENT.md](./GITHUB_DEPLOYMENT.md)
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
