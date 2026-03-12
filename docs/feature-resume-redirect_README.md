# Feature: Resume Upload Redirection

## Why
Users expect to view the parsed results of a resume immediately after uploading. This feature improves UX by providing instant feedback through a parsing status UI and automatically redirecting the user to the Stitch report page once ingestion is complete.

## How it works

The process follows this sequence:

1.  **Frontend (Upload Page)**: User selects or drags a file into the upload zone on `/upload`.
2.  **Frontend (State)**: The UI enters a "Processing" state, showing a spinner and a live log console.
3.  **Backend (Upload API)**: The file is sent to `POST /api/upload-resume`.
4.  **Backend (Controller)**: `uploadRedirectController.js` receives the file.
5.  **Backend (Ingestion)**: The `ingestionService` parses the resume (PDF/DOCX) using AI/Regex extraction.
6.  **Backend (Database)**: A new `Candidate` record is created with the parsed data.
7.  **Backend (Response)**: The server responds with `{ status: 'success', candidateId: '...', logs: [...] }`.
8.  **Frontend (Redirect)**: The upload page receives the `candidateId`, appends the final logs, and navigates to `/report/[candidateId]`.
9.  **Frontend (Adapter)**: The route `/report/[id]` loads the `CandidateProfile` ("Stitch" report) for that ID.

## How to test

### Manual Test Steps

1.  **Start Services**: Ensure both backend and frontend are running.
2.  **Navigate to Upload**: Go to `http://localhost:3000/upload` in your browser.
3.  **Upload Resume**:
    *   Drag a sample PDF or DOCX resume into the drop zone.
    *   Alternatively, click the drop zone to select a file manually.
4.  **Observe Processing**:
    *   Verify the UI changes to a processing state with a "Parsing Resume..." message.
    *   Verify the "Processing Logs" console displays real-time updates (e.g., "Received file", "AI Extraction in progress").
5.  **Verify Redirection**:
    *   After a few seconds, observe the automatic transition to the report page.
    *   The URL should change to `http://localhost:3000/report/<candidate_id>`.
6.  **Verify Content**:
    *   Confirm the Stitch report loads correctly with the name, skills, and experience extracted from the uploaded file.
7.  **Test Error Case**:
    *   Upload an invalid file (e.g., an empty file or unsupported format).
    *   Verify the error message is displayed along with failure logs.
