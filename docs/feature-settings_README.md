# User Settings Feature

## Why This Page Matters
The Settings page gives recruiters, administrators, and candidates autonomy to customize their profile. A modern ATS needs robust permission and user configuration layers. This new robust Settings area provides the UI to manage data that influences notifications, analytics, and team visibility.

## How it Works
**Frontend**: 
- The new `/settings` page (`frontend/src/app/settings/page.tsx`) uses a React Query mutation pattern to interact with the backend API optimistically.
- Framer Motion provides smooth layout switching between three main tabs: `Profile` (general info), `Security` (passwords), and `Notifications` (toggles).
- Forms automatically lock out password resets for users authenticated via Google OAuth, offering safe guardrails based directly on JWT identity data (`user.provider`).

**Backend**:
- Extended `User` Mongoose schema with fields like `bio`, `company`, `location`, `jobTitle`, and `notificationPreferences`.
- Provided a centralized `.patch(updateUserProfile)` controller inside `userController.js` mapped under `/api/users/me`.

## How to Test It
1. Start both servers (`npm run dev` in both `/frontend` and `/backend`).
2. Log into the test recruiter application (e.g. `jane.doe@example.com` / `Password123` or your own test account).
3. Click "Settings" in the sidebar navigation menu.
4. Try modifying your `Job Title` and switching tabs. 
5. The `useUpdateProfile` mutation should fire instantly with a bottom-left success toast if successful.

## What Data is Stored
* **Personal info**: Name, bio, phone, company, location, preferred language.
* **Security info**: Encrypted `password` hashes, OAuth provider identity. 
* **Preferences**: Boolean toggles defining push/email frequencies.

## What Role Can Edit What
- All roles (`admin`, `recruiter`, `candidate`) can manage their own metadata mapped behind `req.user._id` parsed uniquely by the auth token via `userApi.getProfile()`.
- System administrators can query any user explicitly but the generalized `/api/users/me` shields cross-tenant data edits seamlessly.

## Security Notes
- Password updates require a match of the current `$2b$10$...` hash via bcrypt comparison `user.matchPassword(oldPassword)` before overwriting.
- `protect` authorization middleware completely blocks unauthenticated requests from probing the `/api/users/*` namespaces.
