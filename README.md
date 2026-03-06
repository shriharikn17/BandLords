# BandLords

BandLords is a platform for the **Rock and Metal underground scene** that connects bands and fans. Discover bands, find events, and support the scene.

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS (v4)
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (Neon/Supabase compatible)
- **Authentication:** JWT

## Setup Instructions

### 1. Database Setup

Ensure you have PostgreSQL installed or use a cloud provider like Supabase.
Run the SQL script located in `backend/src/db.sql` to initialize your database schema.

### 2. Backend Setup

1. Navigate to the `backend` directory.
2. Run `npm install` to install dependencies.
3. Copy `.env.example` to `.env` and fill in your database credentials and JWT secret.
4. Start the development server using `npm run dev` (you may need to add `"dev": "nodemon src/index.ts"` to your package.json).

### 3. Frontend Setup

1. Navigate to the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Start the Next.js development server using `npm run dev`.
4. Open your browser and go to `http://localhost:3000`.

## Deployment Instructions

### Database (Supabase)
1. Create a new project on Supabase.
2. Copy the database connection string and use it for `DATABASE_URL` in your production backend environment variables.
3. Run the `backend/src/db.sql` script in the Supabase SQL editor to create the tables.

### Backend (Render/Railway/Fly.io)
1. Push your repository to GitHub.
2. Link your GitHub repository to your preferred hosting provider.
3. Set the build command to `npm install && npm run build` (ensure you have a build script in your `package.json` that runs `tsc`).
4. Set the start command to `node dist/index.js`.
5. Add the necessary environment variables (`DATABASE_URL`, `JWT_SECRET`, `PORT`, `NODE_ENV=production`).

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Import the `frontend` directory as a new project on Vercel.
3. Set the root directory to `frontend`.
4. Next.js will automatically be detected and deployed.

## Design
The UI follows a **Dark Brutalist Underground Design Language**:
- Background: near black (#0b0b0b)
- Accent: blood red (#ff0033)
- Typography: bold heavy fonts (Impact / Arial Black)
