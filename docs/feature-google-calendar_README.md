# Google Calendar Interview Scheduling

## Overview
TalentNode now supports interview scheduling with native Google Calendar integration. Recruiters can book interviews with candidates, track statuses, and automatically generate Google Meet links.

## Key Features
- **Integrated Scheduling**: Book interviews directly from a candidate's profile.
- **Google Calendar Sync**: Automatic event creation in the recruiter's primary calendar.
- **Meeting Links**: Dynamic generation of Google Meet links for remote interviews.
- **Interview Management**: A dedicated "Interviews" page to track `scheduled`, `rescheduled`, `canceled`, and `completed` events.
- **Notifications**: Automatic confirmation notifications for recruiters upon successful scheduling.

## Technical Configuration
The system uses the `googleapis` library on the backend to manage OAuth2 flows and Calendar API calls.

### Integration Setup
To enable Google Calendar sync, you must configure the following in your `.env` file:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5001/api/auth/google/callback
```

### How it Works
1. **Model**: The `Interview` model stores candidate, job, recruiter, and Google event identifiers.
2. **Service**: `calendarService.js` handles all technical interactions with Google's API, including token refreshing and Event CRUD.
3. **Controller**: `schedulingController.js` manages the lifecycle of an interview, bridging the bridge between our database and Google's calendar.

## How to Test

### Without a Real Google Account
The system is designed to be resilient. If Google tokens are not present for a recruiter:
1. Go to any candidate's profile.
2. Click **Schedule Interview**.
3. Fill in the details and click **Confirm**.
4. The interview will still be created in the TalentNode database and appear on your **Interviews** page, though no calendar invite will be sent.

### With Google Calendar
1. Ensure your account is logged in via Google (or has tokens stored in the `User` model).
2. Schedule an interview.
3. Verify that a Google Calendar invite is sent to both the candidate and recruiter.
4. Verify the Google Meet link appears in the interview card.

## Permissions Required
The following OAuth scopes are required for full functionality:
- `https://www.googleapis.com/auth/calendar.events` (Manage events)
- `https://www.googleapis.com/auth/calendar.readonly` (View availability)
