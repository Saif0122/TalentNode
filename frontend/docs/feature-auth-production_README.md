# Production Authentication feature

## Overview
This feature implements a robust, production-ready authentication and authorization system using NextAuth. It integrates directly with a MongoDB backend using `mongoose` for both simple email/password credentials and Google OAuth.

## Design Choices
1. **Direct MongoDB Integration (`mongoose`)**:
   - The NextAuth configuration integrates directly with the existing Mongoose `User` model rather than via the `@next-auth/mongodb-adapter`. 
   - This keeps the database cleaner, prevents NextAuth adapter mismatch with Mongoose schema, and provides full control over the `session` and `jwt` callbacks, such as custom JWT tokens structure and user upserting on Google sign-in.
   
2. **JWT Session Strategy**:
   - `JWT` is chosen over `database` sessions for maximum performance and scalability in the edge/middleware regions of Next.js.
   
3. **Role-Based Access Control (RBAC)**:
   - Next.js proxy middleware is configured to automatically guard routes matching `/dashboard/admin/*`, `/dashboard/recruiter/*`, and `/dashboard/candidate/*` ensuring that only valid roles have access.
   
4. **Server-Side API Guards**:
   - Helper functions `requireAuth` and `requireRole` in `src/lib/auth.ts` provide reusable methods to guard Next.js server actions and API endpoints against unauthorized access.

## Environment Variables (`.env.production.example`)
To configure the application for production, ensure the following variables are set:

```env
# URL for the API
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api

# Connect to MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/talentnode?retryWrites=true&w=majority

# NextAuth Variables
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-super-strong-jwt-secret-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Initial Admin Seeding / Login
ADMIN_EMAIL=admin@talentnode.com
ADMIN_PASSWORD=strong-admin-password
```

## Setup & Testing

### 1. Seeding the Admin User
To create the initial Super Admin:
1. Ensure `MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` are configured in `.env.local`.
2. Run the seed script:
```bash
npm run seed:admin
```
This will securely hash the password and insert the admin user with role `admin`.

### 2. Manual Testing Plan
Follow these steps to ensure authentication works seamlessly:

**A. API Authentication & Token Contents**
- Visit `/api/auth/signin`.
- Log in utilizing **Credentials Provider** or **Google Provider**.
- Upon success, use browser dev tools (Application -> Cookies) to observe the `next-auth.session-token` is set with `HttpOnly` and `Lax`.
- In a production build (`NODE_ENV=production`), observe the cookie uses the `__Secure-` prefix and is marked `Secure: true`.

**B. Credential Registration Flow**
- Send a valid POST payload to `/api/auth/register` with `email`, `name`, `password`, and `role` ("candidate").
- Verify the DB for the created user and attempt to sign in with those credentials via the NextAuth prompt.

**C. Testing Middleware Protections**
- Create a test candidate user.
- Log in and navigate manually to `/dashboard/admin` via the URL bar.
- The Next.js middleware should seamlessly redirect you back to `/dashboard` or the appropriate landing page since the JWT `role` is `candidate`, not `admin`.

**D. Admin-Only Login**
- Test the hidden admin login via POST `/api/admin/login` using Insomnia or Postman.
- Send a matching `{ "email": "ADMIN_EMAIL", "password": "ADMIN_PASSWORD" }` from your `.env.local` to receive a direct signed cookie mimicking NextAuth sessions.
