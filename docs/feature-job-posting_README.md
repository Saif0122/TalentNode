# Recruiter Job Posting Feature

## Why This Feature Exists
TalentNode acts as a dynamic ATS (Applicant Tracking System). For the platform to be functional, Recruiters and Administrators need the ability to securely manage Job openings. This feature explicitly restricts mutations (creating, editing, deleting, publishing, archiving jobs) to authorized personnel while leaving read-access public for candidates.

## How it Works
**Backend:**
- Expanded the `Job` Mongoose schema to include `department`, `employmentType`, `salaryRange`, `responsibilities`, `benefits`, `status`, and `postedBy` to make posts significantly richer.
- Bound robust CRUD capability (`PATCH`/`DELETE`/`POST`) to `/api/jobs` but protected by the JWT-verified role `authorize('admin', 'recruiter')` middleware.
- Implemented `/api/jobs/:id/publish` which automatically broadcasts a Global Notification to candidate feeds when triggered.

**Frontend:**
- `useAuth()` intercepts the NextAuth session.
  - If `role === 'recruiter' || role === 'admin'`, the "Create Job" buttons and in-line `JobCard` management actions (Edit, Publish, Delete) render.
  - If `role === 'candidate' or guest`, the UI dynamically restyles itself as a "Candidate Portal", parsing only `status === 'published'` jobs natively without edit actions.
- Beautiful, Framer-motion driven forms created inside `/jobs/create` and `/jobs/[id]/edit` utilizing `useMutation` closures from `@tanstack/react-query` to immediately invalidate queries.

## How to Test Recruiter Access
1. Start both servers (`npm run dev` in `/backend` and `/frontend`).
2. Log into the system using a Recruiter account (e.g. `jane.doe@example.com` assuming the mock seeds are present, or use `admin@talentnode.io`).
3. Click "Jobs" on the sidebar menu. If the text says "Recruiter Portal," the permission check passed.
4. Click "Create Job". Fill out the form entirely and submit.
5. You will see the newly created Job as `DRAFT`.
6. Click `Publish`. Notice a green toast appear, the badge flips to `PUBLISHED`, and a background notification is routed correctly.

## How to Test Unauthorized Access (Candidate View)
1. Sign out of your Recruiter account.
2. Sign in as a Candidate (using standard Google OAuth or a simple standard role.)
3. Click "Jobs". The header will adapt to say "Candidate Portal".
4. The `Create Job` button will not exist.
5. Direct Navigation blocks: If you attempt to manipulate Postman and hit `POST /api/jobs`, the backend will instantly reject with a `403 Forbidden` response.

## Verifying Dashboard Side-Effects
Recruiters look at "Active Jobs" on their `/dashboard`.
- The `dashboardController.js` only computes `Job.countDocuments({ status: 'published' })`. 
- By utilizing `queryClient.invalidateQueries(['dashboard'])` whenever a job is created, published, or deleted, React Query ensures the Dashboard integers update locally in the browser *instantly* without a manual refresh.
