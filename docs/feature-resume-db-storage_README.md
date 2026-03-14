# Persistent Resume Data Storage (MongoDB Atlas)

This feature replaces ephemeral local storage with deep, persistent storage in MongoDB Atlas for all candidate resumes and AI processing results.

## Architecture

1.  **System of Record**: MongoDB Atlas is now the absolute source of truth for all candidate data.
2.  **Expanded Schema**: The `Candidate` model has been enhanced to store:
    *   `rawResumeText`: The full text extracted by our ingestion service.
    *   `experienceYears`: Normalized years of experience for powerful filtering.
    *   `education`: List of academic achievements detected.
    *   `analysisHistory`: A permanent log of AI scores, summaries, and match reasoning.
    *   `uploadedFiles`: Tracking of every file version uploaded for a candidate.

## Why Local Storage was Removed
- **Persistence across devices**: Recruiters can now access reports from any browser/device without losing data.
- **Deep Analytics**: Storing raw text and analysis in the DB allows for system-wide analytics and candidate comparisons.
- **Reliability**: Eliminates the "vanishing report" issue that occurs when clearing browser cache or switching sessions.

## How the Flow Works
1.  **Upload**: User uploads a PDF/Docx or pastes text on `/resumes/upload`.
2.  **Ingestion**: Express backend parses the file and calls Gemini AI for structured extraction.
3.  **Persistence**: The backend immediately saves the `parsedResume`, `rawResumeText`, and `analysisHistory` to MongoDB.
4.  **Redirection**: The backend returns the `candidateId`.
5.  **Rendering**: The frontend redirects to `/report/[candidateId]`, which fetches the full profile data from the database.

## Verification
- **DB Check**: Open MongoDB Atlas/Compass and verify the `candidates` collection contains documents with `rawResumeText`, `experienceYears`, and `analysisHistory`.
- **Refresh Test**: On any candidate report page, refresh the browser. The data should load instantly from the API, confirming it is not dependent on local storage.
- **DevTools Check**: Open Application tab -> Local Storage. Verify no large resume objects or "parsedData" keys are being stored.

---
*Developed by Antigravity*
