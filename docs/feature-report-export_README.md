# Feature: Candidate Report Export

Recruiters can now export full candidate reports as professional PDFs for offline review, sharing with stakeholders, or inclusion in external HR systems.

## Why Export is Useful
- **Stakeholder Sharing**: Easily send candidate details to hiring managers who may not have platform access.
- **Offline Review**: Print or save reports for physical interview folders.
- **Compliance & Auditing**: Maintain a static record of a candidate's profile and AI match score at the time of evaluation.

## How it Works
1. **Dynamic PDF Generation**: The backend uses `pdfkit` to compile data from the `Candidate`, `Job`, and `Interview` collections.
2. **AI Insights Inclusion**: The report includes the latest AI match score, fit summary, and skill analysis.
3. **Professional Layout**: Includes a branded header, distinct sections for experience and skills, and a generated footer.

## How to Test PDF Generation
1. Navigate to a **Candidate Report** page (e.g., `/report/{id}`).
2. Click the **Export Report** button in the header.
3. Wait for the generation process (indicated by the loading spinner).
4. Verify the file downloads automatically with the name format `Report_Candidate_Name.pdf`.

## How to Verify Downloaded File
- Open the PDF in any viewer (Adobe Acrobat, Chrome, etc.).
- Ensure all sections (Summary, Skills, Experience) are present and readable.
- If the candidate has scheduled interviews, verify that the interview history section is displayed.
- Check that the AI score matches the value shown on the platform.
