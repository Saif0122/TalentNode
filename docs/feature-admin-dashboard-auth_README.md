# Admin Dashboard Authentication

This feature provides a secure, isolated authentication flow for administrators of the TalentNode platform.

## Architecture

1.  **Isolated Login**: A dedicated login page is available at `/auth/admin`. This page is not linked from the main site navigation to prevent unauthorized discovery.
2.  **Role Enforcement**:
    *   **Backend**: The `login` controller in `authController.js` logs admin access and tracks `lastLoginAt`.
    *   **Frontend**: Next.js `middleware.ts` strictly redirects non-admin users away from `/admin` and `/dashboard/admin` routes.
3.  **Dynamic UI**: The `Sidebar.tsx` component automatically hides sensitive links (Analytics, Experiments, System Logs) from non-admin users.

## Security Features

- **isActive Flag**: Admins can deactive any user account directly in MongoDB. The system will block login for deactivated accounts.
- **Audit Logging**: All admin login attempts and RBAC violations are logged on the server.
- **Sub-Dashboard Protection**: Even if a user knows the URL to an admin feature, the middleware will intercept the request and redirect them to the standard dashboard.

## Administrative Tasks

### Seeding the Admin Account
To create or reset the main admin account:
```bash
cd backend
node scripts/seedAdmin.js
```

### Deactivating a User
Update the user document in MongoDB Atlas/Compass:
```javascript
db.users.updateOne({ email: 'target@example.com' }, { $set: { isActive: false } })
```

### Verifying Admin Logs
Check the backend console for tags like `[Auth]` and `[RBAC]`. Failed attempts for restricted routes will be logged as warnings.

---
*Developed by Antigravity*
