# Multi-Format Resume Upload System

## Overview
TalentNode's resume ingestion engine has been upgraded. Initially, it solely supported standard PDFs or specific .docx templates and automatically uploaded files the moment they were selected (leading to accidental uploads). 

The upgraded system provides an interactive File Preview interface before upload, supports more binary formats natively, and includes a literal "Raw Text Paste" fallback if an exotic or corrupted file format is encountered by recruiters.

## How It Works

### Frontend Architecture
Located at `frontend/src/app/upload/page.tsx`:
1. **Interactive Tabs**: Users choose between "Upload Document" and "Paste Raw Text".
2. **File Staging State**: Dropping a file updates the internal React state (`setFile()`) rather than triggering an API call immediately.
3. **MIME Detection & Icons**: A helper visually renders a PDF, Word, or Text icon based on the file extension and displays file size in megabytes.
4. **Validation Routing**: If the Backend API (`/api/upload-resume`) throws an error (e.g. `400 Bad Request` or an unsupported file trap `500`), the `axios` error payload is unpacked and rendered directly inside a red toast on the UI, rather than hanging indefinitely.

### Backend Handlers
Located in `backend/controllers/uploadRedirectController.js` and `backend/services/ingest.js`:
1. **Dynamic Overrides (`rawText`)**: If `req.body.rawText` is passed instead of `req.file`, the backend skips file buffering entirely and proceeds to heuristic extraction.
2. **Mammoth Fallbacks**: For `application/msword` files (.doc) that `mammoth` fails to parse natively, the ingest system uses a brute-force ASCII string normalization regex to pull whatever visible English text it can scrape from the binary buffer to prevent a hard crash.
3. **Explicit `.txt` and `.rtf` handlers**: Reads UTF-8 buffers directly. Basic bracket stripping is applied to `.rtf` headers out-of-the-box.
4. **Rejection Safety**: If extracted string length is `< 50` characters, an explicit Error object is sent to the frontend reading "Unsupported file type", letting the user know they should paste it manually. 

## Testing the System

### Manual Verification
1. Open the app to `localhost:3000/upload`.
2. Click the Upload zone and select a `.pdf`. Verify the card shows the correct name and size with a clear "Extract & Parse" button under it.
3. Click Extract & Parse. Note the streaming log UI before the redirect.
4. Hit the back browser button (or go to `/upload` again) and click `Paste Raw Text`.
5. Paste any paragraph of text (e.g., your LinkedIn profile) and click Extract. Ensure identical routing triggers.
