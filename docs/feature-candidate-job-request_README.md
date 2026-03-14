# Candidate-to-Hiring-Team Job Request Flow

This feature enables a proactive engagement model where candidates can request direct reviews or connections for specific job roles before or alongside a traditional application.

## Overview

Traditional application flows are passive. The **Job Request Flow** adds a "warm" introduction layer, allowing top talent to signal high interest and allowing recruiters to prioritize high-intent candidates.

## How it Works

### 1. Candidate Submission
- Candidates browse jobs at `/jobs`.
- On the job detail page, candidates see two new actions:
    - **Request Review**: Asks the AI/Recruiter to prioritize their resume analysis.
    - **Request Connection**: Signals interest in a direct conversation with the hiring team.
- Submitting a request creates a `JobRequest` record in MongoDB and triggers a notification for the hiring team.

### 2. Recruiter Review
- Recruiters see a "Job Requests" count on their primary Dashboard.
- Within a specific Job Detail page, recruiters can access the **Incoming Requests** tab.
- Recruiters can:
    - View the candidate's parsed report.
    - **Approve**: Moves the request to an active state and notifies the candidate.
    - **Reject**: Archives the request and notifies the candidate.

## Technical Details

- **Model**: `JobRequest` stores `candidateId`, `jobId`, `status` (Pending/Approved/Rejected), and `message`.
- **RBAC**: 
    - Candidates can only create requests.
    - Admin/Recruiter roles can view and review (Patch) requests.
- **Notifications**: Integrated with the system's `Notification` model to provide real-time feedback to both parties.

## Testing & Verification

1. **Submit Request**:
    - Log in as a Candidate.
    - Go to a Job page and click "Request Review".
    - Verify the alert "Request sent to the hiring team!".
2. **Approve Request**:
    - Log in as an Admin/Recruiter.
    - Go to the same Job page -> "Incoming Requests" tab.
    - Click "Approve".
    - Verify the status badge updates to "Approved".
3. **Verify Notification**:
    - Check the `notifications` collection in MongoDB for new entries related to the request.

---
*Developed by Antigravity*
