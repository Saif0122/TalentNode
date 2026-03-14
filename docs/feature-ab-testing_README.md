# Feature: A/B Scoring Experiments

TalentNode now supports A/B testing of candidate scoring algorithms to ensure the most accurate matching for recruiters.

## Why Experiments Matter
- **Accuracy Verification**: Compare multiple heuristics or AI models against real resumes.
- **Continuous Improvement**: Iteratively refine scoring weights (Skills vs. Experience vs. Keyword Density).
- **Reduced Bias**: Identify variations in how different algorithms evaluate diversity and background.

## How it Works
1. **Scorer A (Standard)**: Uses a balanced heuristic (50% Skills, 30% Experience, 20% Textual Keyword Match).
2. **Scorer B (Skill-Focused)**: Prioritizes technical skills (70%) and treats experience as a secondary depth indicator (20%).
3. **Comparison Tool**: Runs both scorers on the same candidate pool and calculates a "Winner" based on average performance and confidence levels.

## How to Test Scorer A vs B
1. Navigate to the **Experiments** page via the sidebar.
2. Select an existing experiment or create a new one choosing a Job and a set of Candidates.
3. Click **Run Analysis**.
4. View the side-by-side comparison to see how the scores and reasoning summaries differ.

## Data Storage
- Experiments are stored in the `Experiment` collection.
- Results include the exact scores, reasoning strings, and confidence levels generated at the time of execution.
- This history allows recruiters to audit why certain candidates were prioritized in the past.

## Interpreting Results
- **Winner**: Highlighted based on the algorithm that yields the highest average scores for the selected pool.
- **AI Summary**: Scorer-specific summaries explain the "perspective" of each algorithm (e.g., "Skill-Focused emphasizes toolkit").
