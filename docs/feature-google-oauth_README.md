# Google OAuth Configuration & Troubleshooting

This guide explains how to fix the `invalid_client` error and correctly configure Google Sign-in for TalentNode.

## Why 401 `invalid_client` happened
The error occurred because the application was using placeholder (`mock_client_id`) credentials. Google's authorization servers reject any request that doesn't provide a valid, registered Client ID.

## How it works
1.  **NextAuth Frontend**: Initiates the OAuth flow. We've added **runtime validation** to ensure that if credentials are missing or mock, a clear error is logged in your terminal.
2.  **Google Callback**: After user consent, Google redirects to `/api/auth/callback/google`.
3.  **Backend Upsert**: NextAuth forwards the user profile to the backend (`/api/auth/google`).
4.  **Security Check**: The backend now checks if the account is `active`. If an admin has deactivated the user in MongoDB, login will be denied even via Google.

## Setup Instructions

### 1. Google Cloud Console Configuration
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services > Credentials**.
4.  Click **Create Credentials > OAuth client ID**.
5.  Select **Web application** as the application type.
6.  Add **Authorized JavaScript origins**:
    *   `http://localhost:3000`
7.  Add **Authorized redirect URIs**:
    *   `http://localhost:3000/api/auth/callback/google`
8.  Copy your **Client ID** and **Client Secret**.

### 2. Update Environment Variables
Update the following files with your real credentials:

**`frontend/.env.local`**:
```env
GOOGLE_CLIENT_ID=your_real_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_real_client_secret
```

**`backend/.env`**:
```env
GOOGLE_CLIENT_ID=your_real_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_real_client_secret
```

### 3. Verification
1.  Restart both frontend and backend servers.
2.  Navigate to `http://localhost:3000/auth/login`.
3.  Click **Google Workspace**.
4.  If correctly configured, you will see the Google consent screen.
5.  Check the backend logs for: `[Auth] Google user logged in: ...`

## Troubleshooting Missing Env Values
If you see `[OAuth Error] GOOGLE_CLIENT_ID is missing...` in your frontend terminal, it means Next.js cannot find the variables. Ensure you are using `.env.local` in the `frontend` folder and that the server was restarted after the changes.

---
*Developed by Antigravity*
