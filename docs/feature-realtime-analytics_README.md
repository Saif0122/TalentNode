# Real-time MongoDB-Driven Analytics

TalentNode now features a fully dynamic analytics dashboard that computes enterprise metrics directly from your MongoDB Atlas collections.

## Why Real-time Analytics Matters
- **Actionable Insights**: Immediate visibility into hiring velocity and pipeline bottlenecks.
- **Data Integrity**: Removes dependency on static mock data, ensuring recruiters see the true state of their talent acquisition.
- **Global Visibility**: Aggregates data across all jobs, candidates, and hiring nodes.

## How Metrics are Computed

### 1. KPI Calculations
- **Time to Hire**: Computed as the average difference between `createdAt` and `hiredAt` for candidates marked as 'Hired'.
- **Offer Acceptance**: Ratio of 'Hired' candidates to the total number of candidates who reached the 'Offer' or 'Rejected' (after offer) stage.
- **AI Matching Accuracy**: Proxy calculated using the average AI confidence scores aggregated from all parsed resumes.

### 2. Pipeline Funnel
- Dynamically counts candidates at each stage: `Applied` -> `Screening` -> `Interview` -> `Offer` -> `Hired`.

### 3. Source Performance
- Utilizes MongoDB Aggregation pipelines to group candidates by `source` and calculate hire rates for each channel.

### 4. Recruiter Performance
- Joins the `Candidate` and `User` collections to attribute hires to specific recruiters and calculate their processing velocity.

## How to Test

1. **Verify Live Data**:
   - Change a candidate's status to 'Hired' in the Talent Pool.
   - Navigate to the Analytics page.
   - Verify that 'Hired Candidates' count and 'Time to Hire' metrics reflect the change.
2. **Skill Demand**:
   - Create a new Job with specific `requiredSkills`.
   - Verify those skills appear or rise in the "Skill Demand Trends" section.
3. **D&I Tracking**:
   - Add a candidate with a specific source (e.g., 'Referral').
   - Verify the "Underrepresented" metric updates based on the referral percentage proxy.

## API Endpoints
- `GET /api/analytics/overview`
- `GET /api/analytics/conversion`
- `GET /api/analytics/sources`
- `GET /api/analytics/recruiters`
- `GET /api/analytics/di-metrics`

---
*Developed by Antigravity*
