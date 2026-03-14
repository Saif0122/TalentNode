# Talent Pool & Global Discovery Tools

The Talent Pool is the central hub for candidate relationship management and enterprise-wide deep searching.

## Key Features

### 1. Global AI Search
- **Unified Discovery**: A single search bar that queries across Candidates, Jobs, Job Requests, Reports, and Interviews.
- **Real-time Results**: Shows a snapshot of matching entities across the entire system, allowing for quick navigation.
- **Persistence**: Filters and search queries are persisted locally, ensuring you don't lose context between sessions.

### 2. Candidate Status Management
- **Quick Toggles**: Direct status updates (Applied, Screening, Interview, etc.) for candidates from the list view.
- **System Synchronization**: Updating a status instantly updates the system record and reflects in dashboard metrics.

### 3. Bulk Engagement
- **Bulk Messaging**: Targeted communication with multiple candidates simultaneously.
- **Notification Support**: High-priority notifications are triggered for recruiters when bulk actions are completed.

### 4. Search & Filter State
- **AI Filters**: Refine the talent pool by skills, location, and match confidence.
- **Saved Searches**: Save complex filter configurations for one-click access in future sessions.

## How to Test

### 1. Global Search
- Enter a keyword (e.g., "React") in the primary search bar.
- Click **Global Search**.
- Verify the "Global Discovery Results" widget appears with counts for Jobs, Candidates, etc.

### 2. Status Update
- Find a candidate and change their status using the dropdown.
- Refresh the page and verify the status persists.

### 3. Bulk Actions
- Click **Bulk Message**.
- Enter a message and confirm.
- Verify the success alert and check the dashboard for a "Bulk Action Complete" notification.

## API Behavior
- `GET /api/search?q=...`: Performs case-insensitive regex search across indexed fields.
- `PATCH /api/candidates/:id/toggle-status`: Atomically updates the candidate state.
- `POST /api/candidates/save-search`: Stores criteria in MongoDB associated with the recruiter profile.

---
*Developed by Antigravity*
