# Dynamic Dashboard Feature

## Why this feature exists
The TalentNode dashboard previously displayed hardcoded, static data (e.g., "1,402 Resumes Parsed", "28 High-Match Candidates"). This prevented users from seeing a real-time overview of their recruiting pipeline. This feature replaces those static strings with live metrics driven by the MongoDB database, providing an accurate and dynamic representation of platform activity without modifying the user interface aesthetics.

## How it works
1. **Backend Endpoints:** We introduced a new `dashboardController.js` and mounted it at `/api/dashboard`. 
   - `GET /api/dashboard/stats`: Aggregates total jobs, active candidates, and parses.
   - `GET /api/dashboard/activity`: Returns the 5 most recently created candidates and jobs.
   - `GET /api/dashboard/top-skills`: Aggregates the most requested skills from all active job postings.
   - `GET /api/dashboard/conversion`: Computes basic funnels (e.g., applied vs interviewed) dynamically based on current numbers.
   - `POST /api/dashboard/seed`: An endpoint to quickly populate 5 dummy candidates and 3 dummy jobs if the DB is completely empty (useful for testing/demo environments).
2. **Frontend Hooks:** We created `useDashboard.ts` using TanStack Query to fetch these endpoints.
3. **UI Integration:** The `DashboardPage` component consumes data from these hooks and injects it directly into the `StatCard` and activity table components. 
4. **Action Side-Effects (Live Updating):** Because the Dashboard uses TanStack Query, and action pages (like `/resumes/upload`) trigger `queryClient.invalidateQueries()`, the dashboard instantly reflects new uploads or job creations once the user navigates back to it.

## Which files were changed
- **Backend:**
  - `[NEW] backend/controllers/dashboardController.js`
  - `[NEW] backend/routes/dashboardRoutes.js`
  - `[MODIFIED] backend/server.js` (mounted the new routes)
- **Frontend:**
  - `[NEW] frontend/src/hooks/useDashboard.ts`
  - `[MODIFIED] frontend/src/lib/api.ts` (added `dashboardApi` export)
  - `[MODIFIED] frontend/src/app/dashboard/page.tsx` (replaced static data with hooked data)

## How to test it
1. Ensure both the frontend (`npm run dev` in `/frontend`) and backend (`npm run dev` in `/backend`) are running.
2. If your database is empty, seed it by hitting the seed endpoint (e.g., via Postman or by temporarily adding a button to call `dashboardApi.seed()`), or simply upload a new resume through the UI.
3. Navigate to **Dashboard** (`/dashboard`). You should see the metric cards displaying live counts (e.g. 1 Job, 1 Resume Parsed).
4. Navigate to **Resumes** (`/resumes/upload`) and upload a PDF.
5. Return to the **Dashboard**. Note that the "Resumes Parsed" counter has incremented and the candidate appears at the top of the "Recent Pipeline Activity" table.

## Expected API responses

**`GET /api/dashboard/stats`**
```json
{
  "success": true,
  "data": {
    "totalCandidates": 5,
    "totalJobs": 3,
    "activeJobs": 3,
    "totalApplications": 10,
    "resumesParsed": 5,
    "highMatchCandidates": 3
  }
}
```

**`GET /api/dashboard/activity`**
```json
{
  "success": true,
  "data": {
    "recentCandidates": [
      {
        "_id": "64...",
        "name": "Jane Doe",
        "location": "Remote",
        "parsedResume": { ... },
        "createdAt": "2023-10-25T12:00:00.000Z"
      }
    ],
    "recentJobs": [
       ...
    ]
  }
}
```
