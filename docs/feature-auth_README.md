# Feature: Comprehensive Authentication

## Why
Secure, role-based access is essential for a recruitment platform. This feature implements a complete authentication system with:
- **Email/Password**: Traditional credential-based login.
- **Google OAuth**: Fast, secure sign-in via Google accounts.
- **Role-Based Access Control (RBAC)**: Supports Admin, Recruiter, and Candidate roles.
- **Session Management**: Secure frontend sessions using NextAuth.js and HttpOnly tokens in the backend.

## How it works

### Register Flow (Credentials)
1. User selects a role (Recruiter/Candidate) and fills in details at `/auth/register`.
2. Frontend sends data to `POST /api/auth/register`.
3. Backend hashes password using `bcryptjs` and stores User in MongoDB.

### Login Flow (Credentials)
1. User enters email/password at `/auth/login`.
2. NextAuth `CredentialsProvider` calls backend `POST /api/auth/login`.
3. Backend validates credentials and returns a signed JWT.
4. NextAuth stores the token/user data in a secure, encrypted JWT frontend session.

### Google OAuth Flow
1. User clicks "Google Workspace" sign-in.
2. NextAuth handles the Google OAuth 2.0 handshake.
3. In the `signIn` callback, frontend calls `POST /api/auth/google`.
4. Backend upserts the user in the database and returns a backend JWT.
5. Frontend session is established.

### Session Persistence
- The `useAuth` hook provides easy access to `user`, `role`, and `isAuthenticated` status by combining NextAuth session data and fresh profile data from `/api/auth/me`.

## How to test

1.  **Preparation**:
    - Update `.env` in both backend and frontend with necessary secrets.
    - Run `node backend/scripts/seedAdmin.js` to create a default admin.
2.  **Registration**:
    - Navigate to `/auth/register`.
    - Create a "Recruiter" account.
    - Confirm you are redirected to the login page.
3.  **Login**:
    - Log in with the new credentials.
    - Verify you are redirected to `/dashboard`.
    - Access a protected route, e.g., `/upload`.
4.  **Google Sign-in**:
    - Log out, then click the Google button on the login page.
    - Complete the Google authentication flow.
5.  **Role Protection**:
    - Verify your role is correctly displayed/respected in the app.
6.  **Logout**:
    - Click logout and confirm you are redirected to the login page and cannot access protected routes anymore.
