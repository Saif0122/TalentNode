# TalentNode Monorepo

This project contains the TalentNode web application, split into a frontend and a backend.

## Structure

- `frontend/`: Next.js application (App Router, TypeScript).
- `backend/`: Express + Node.js server.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository.
2. Install dependencies in both folders:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in both `frontend/` and `backend/`.

### Development

To run both apps concurrently from the root (if root scripts are set up):
```bash
npm run dev
```

Or individually:
- **Frontend**: `cd frontend && npm run dev`
- **Backend**: `cd backend && npm run dev`

### Build

- **Frontend**: `cd frontend && npm run build`
- **Backend**: `cd backend && npm run build` (if applicable)
