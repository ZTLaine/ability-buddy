# Authentication Debugging Guide

## Issue Summary
Authentication works locally but fails in production (Railway). The root cause is likely the difference in session strategies:
- **Local**: JWT sessions (client-side cookies)
- **Production**: Database sessions (server-side database storage)

## Current Changes Made

1. **Added Debug Logging**: Enhanced NextAuth configuration with detailed logging
2. **Temporary Fix**: Forced JWT sessions for both environments to test the hypothesis
3. **Environment Variable Logging**: Added logging to check if required environment variables are set

## How to Debug Network Calls

### Step 1: Open Developer Tools
- **Chrome/Edge**: `F12` or `Ctrl+Shift+I`
- **Firefox**: `F12` or `Ctrl+Shift+I`
- **Safari**: `Cmd+Option+I`

### Step 2: Network Tab Setup
1. Click on the **Network** tab
2. Check **Preserve log** (keeps requests during page changes)
3. Clear network log (🚫 button)
4. Filter by **XHR** or **Fetch** to see API calls only

### Step 3: Monitor Key Authentication Requests

#### A. Login Attempt
```
POST /api/auth/callback/credentials
```
**What to check:**
- **Status Code**: Should be 200 OK
- **Request Body**: Contains email and password
- **Response Body**: Look for error messages or redirect URLs
- **Headers**: Check for Set-Cookie headers

#### B. Session Check
```
GET /api/auth/session
```
**What to check:**
- **Status Code**: Should be 200 OK
- **Response Body**: Should contain user data or null
- **Headers**: Check Cookie headers being sent

#### C. NextAuth Internal Calls
```
GET /api/auth/providers
POST /api/auth/signin
GET /api/auth/csrf
```

### Step 4: What to Look For

#### Request Headers
- `Cookie`: Should contain session/token cookies
- `Content-Type`: Usually `application/x-www-form-urlencoded` or `application/json`
- `X-Requested-With`: Often present for AJAX requests

#### Response Headers
- `Set-Cookie`: New session cookies being set
- `Location`: Redirect URLs for successful auth
- `Cache-Control`: Caching directives

#### Response Status Codes
- **200 OK**: Success
- **302 Found**: Redirect (normal for auth flows)
- **401 Unauthorized**: Authentication failed
- **403 Forbidden**: User authenticated but not authorized
- **500 Internal Server Error**: Server-side issue

#### Response Body Examples

**Successful Login:**
```json
{
  "url": "/resources",
  "ok": true,
  "status": 200
}
```

**Failed Login:**
```json
{
  "error": "CredentialsSignin",
  "status": 401,
  "ok": false
}
```

**Session Response (Authenticated):**
```json
{
  "user": {
    "id": "user123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  },
  "expires": "2024-02-01T10:00:00Z"
}
```

**Session Response (Not Authenticated):**
```json
null
```

## Common Issues & Solutions

### 1. Database Session Issues
**Symptoms:**
- Login works locally but not in production
- Session requests return null in production
- Console logs show database connection errors

**Solutions:**
- Verify database connection in production
- Check if `Session` table exists and is properly migrated
- Ensure `NEXTAUTH_URL` is set correctly for production

### 2. Environment Variable Issues
**Symptoms:**
- 500 errors during authentication
- Missing configuration errors in logs

**Required Environment Variables:**
```
NEXTAUTH_URL=https://your-production-url.com
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=your-database-connection-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 3. Cookie/CORS Issues
**Symptoms:**
- Cookies not being set or sent
- CORS errors in browser console

**Solutions:**
- Ensure `NEXTAUTH_URL` matches your production domain
- Check if your domain supports secure cookies (HTTPS)
- Verify cookie SameSite and Secure attributes

### 4. Database Migration Issues
**Symptoms:**
- Tables not found errors
- Schema mismatch errors

**Solutions:**
- Run `npx prisma db push` or `npx prisma migrate deploy`
- Verify all NextAuth tables exist: `User`, `Account`, `Session`, `VerificationToken`

## Testing the Current Fix

With the temporary JWT session fix in place:

1. **Deploy to Production**: Push the changes to Railway
2. **Test Login**: Try logging in with email/password
3. **Check Console Logs**: Look for the debug output in Railway logs
4. **Check Network Tab**: Monitor the authentication requests

### Expected Behavior with JWT Sessions
- Login should work in both environments
- Session data stored in JWT cookies instead of database
- No database session table dependencies

## Next Steps

### If JWT Sessions Fix the Issue
1. **Root Cause**: Database session strategy is the problem
2. **Options**:
   - Keep JWT sessions for both environments
   - Fix database session implementation
   - Use JWT for production temporarily

### If Issue Persists
1. **Check Environment Variables**: Verify all required variables are set
2. **Database Connection**: Test database connectivity in production
3. **Cookie Issues**: Check if cookies are being set/sent properly
4. **CORS/Domain Issues**: Verify NEXTAUTH_URL configuration

## Production Debugging Commands

### Railway CLI Commands
```bash
# View logs
railway logs

# Check environment variables
railway variables

# Connect to database
railway connect
```

### Database Verification
```sql
-- Check if NextAuth tables exist
SHOW TABLES LIKE '%Session%';
SHOW TABLES LIKE '%Account%';
SHOW TABLES LIKE '%User%';

-- Check existing sessions
SELECT * FROM Session LIMIT 5;
```

## Contact Support

If the issue persists after trying these steps:
1. **Collect Network Logs**: Save network requests showing the failure
2. **Gather Environment Info**: Note which environment variables are set
3. **Database Status**: Check if database tables exist and are accessible
4. **Error Messages**: Copy exact error messages from browser console and server logs

Remember: Authentication debugging often requires checking both client-side (browser) and server-side (Railway logs) to get the complete picture.