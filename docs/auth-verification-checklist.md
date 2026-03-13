# TalentNode Request Verification Checklist

Use this checklist to verify that authentication is working correctly between the frontend and backend.

## Frontend Verification (Client Side)

- [ ] **Session Check**: `const { data: session } = useSession()` returns a session object.
- [ ] **Token Presence**: `session.user.accessToken` is a non-empty string.
- [ ] **Role Presence**: `session.user.role` is either `recruiter`, `admin`, or `candidate`.
- [ ] **Axios Interceptor**: Verify that the `Authorization` header is being attached.
  - Open Chrome DevTools > Network tab.
  - Filter by `Fetch/XHR`.
  - Look for outgoing requests to `http://localhost:5001/api/...`.
  - Check **Request Headers** for `Authorization: Bearer <token>`.
  - Verify `withCredentials: true` is set (Request Headers > `Cookie` might be present, but `Authorization` is primary).

## Backend Verification (Server Side)

- [ ] **CORS Check**: Response headers for preflight (`OPTIONS`) show `Access-Control-Allow-Origin` matching `FRONTEND_URL` and `Access-Control-Allow-Credentials: true`.
- [ ] **Middleware Logs**: Check backend terminal for:
  - `[Auth] Incoming Request: ...`
  - `[Auth] Token found in Authorization header`
  - `[Auth] Token verified for User ID: ...`
  - `[Auth] User authenticated: ... (Role: ...)`
  - `[Auth] Access Granted: Role '...' matches requirements`
- [ ] **403 Errors**: If a `403 Forbidden` occurs, check the console for:
  - `[Auth] Access Denied: User role '...' not in permitted roles [...]`
  - Verify the endpoint's `authorize(...)` call matches the user's role in the database.

## Common Fixes

- **Roles Mismatch**: Check the `User` document in MongoDB Atlas/Compass. Ensure the `role` field is exactly what you expect (lowercase, no extra spaces).
- **Token Expiry**: If `[Auth] JWT Verification Failed` appears, the token might be expired. Logout and log back in.
- **CORS Block**: Ensure `FRONTEND_URL` in backend `.env` matches the browser URL (e.g., `http://localhost:3000`).
