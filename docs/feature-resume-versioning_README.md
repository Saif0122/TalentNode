# Resume Versioning & Comparison

This feature allows recruiters to track changes in a candidate's resume over time, highlighting specific improvements, new skills, and experience growth.

## Why This Matters
- **Growth Tracking**: See how a candidate has upskilled between applications.
- **Verification**: Detect inconsistencies or significant changes in professional history.
- **Collaboration**: Provide better context to hiring managers about a candidate's trajectory.

## How It Works
1. **Automatic Versioning**: Every time a resume is uploaded (via file or text paste) for an existing candidate (matched by email or name), TalentNode stores the previous state in an `uploadHistory` array and updates the main profile with the latest data.
2. **Side-by-Side Diffing**: The system uses a word-level diffing algorithm to compare summaries and structured data comparison for skills and experience.
3. **Visual Highlights**:
   - <span style="color: #10b981">**Green Highlights**</span>: Added content.
   - <span style="color: #f43f5e; text-decoration: line-through">**Red Strikethrough**</span>: Removed content.
   - **Badges**: New skills are tagged with "New", and modified experience items show a "Modified" badge.

## How to Test Version Compare
1. Upload a resume for "John Doe".
2. Go to the Candidate Report.
3. Upload a *modified* resume for the same "John Doe" (or use the same name/email).
4. In the Report page, you will see a "Resume Versions" panel in the right sidebar.
5. Select the two versions.
6. Click "Compare Selected".

## Verification of Diff Output
- **Summary**: Verify that added words are green and removed words are red and struck through.
- **Skills**: Verify "Newly Added" section contains only skills present in the newer version but not the older one.
- **Experience**: If a description of a job changed, verify the "Modified" badge appears and the specific text changes are highlighted.
