# Connection-Based Interview Scheduling

TalentNode now enforces a strict "Connected-First" scheduling policy. This ensures that interviews are only scheduled after a mutual connection has been established between a recruiter and a candidate.

## Why this condition exists
- **Privacy & Security**: To prevent unauthorized scheduling and ensure both parties have opted into communication.
- **Intent Verification**: Confirms that candidates and recruiters from external sources (LinkedIn, Upwork) have successfully transitioned to our platform.
- **Role Alignment**: Ensures that only valid candidate profiles with associated platform accounts can be officially interviewed.

## How it Works

### 1. Connection Request
Connections can be established in three ways:
- **Platform Request**: A recruiter sends a connection request directly within TalentNode.
- **External Imports**: Candidates imported from **LinkedIn** or **Upwork** trigger an automatic connection flow when their profile is verified.
- **Manual Approval**: Candidates can accept connection requests via the platform notifications or settings.

### 2. Status Enforcement
The backend `schedulingController` now includes a strict check:
- It looks for an `Accepted` connection between the `recruiterId` (requester) and the `targetUserId` associated with the candidate's email.
- If no connection is found, the API returns a `403 Forbidden` error.

### 3. Scheduling Workflow
1. Establish a connection with the candidate.
2. Open the **Schedule Interview** modal from the Candidate profile.
3. Provide the **Date**, **Time**, **Duration**, and a **Meeting Link**.
4. Upon confirmation, the interview is stored in MongoDB and synced with Google Calendar (if tokens are present).

## How to Test

### Positive Case (Allowed)
1. Ensure a user exists for the candidate email.
2. Create an `Accepted` connection in MongoDB between yourself and that user.
3. Schedule an interview via the UI. It should succeed.

### Negative Case (Blocked)
1. Attempt to schedule an interview with a candidate email that has no associated platform account or no accepted connection.
2. The UI will display an error message: *"You must have an approved connection with this candidate to schedule an interview."*

## Technical Details
- **New Model**: `Connection` (requester, recipient, source, status).
- **Endpoint**: `POST /api/connections/request` & `POST /api/connections/accept`.
- **Validation**: Enforced server-side in `createInterview` controller.

---
*Developed by Antigravity*
