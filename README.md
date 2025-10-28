lern — minimal MERN learning platform
=====================================

Project name: lern (short name as requested)

Structure:
  /backend  - Express + Mongoose API
  /frontend - React app (created to be simple and easy to run)

Quick start (in VS Code terminal)
--------------------------------
1) Backend:
   cd backend
   copy .env.example to .env and set MONGO_URI (or use local mongodb)
   npm install
   npm run dev
   (server runs on port 5000 by default)

2) Frontend:
   cd frontend
   copy .env.example to .env or set REACT_APP_API if needed
   npm install
   npm start

Notes:
- You need Node.js installed (v16+ recommended) and npm.
- To use MongoDB Atlas, replace MONGO_URI in backend/.env with your connection string.
- This is a minimal starter app (list + add courses). You can extend it:
  authentication, user roles, course content, file uploads, payments, etc.

Enjoy — if you want I can:
  • add authentication (JWT),
  • add Dockerfile and docker-compose,
  • expand frontend with routing and pages,
  • or create a GitHub repo and CI workflow.

