# Copilot Instructions for JobPortal

## Architecture Overview

MERN-based job portal with Auth0 authentication. **Monorepo structure**: `client/` (empty placeholder) + `server/` (active backend).

**Stack**: Express 5.x (ES Modules) + MongoDB (Mongoose 9.x) + Auth0 (`express-openid-connect`)

**Auth Flow**: Auth0 login → callback to `/` → user synced to MongoDB via `enusureUserInDB()` → redirect to `CLIENT_URL`

**Data Model**: Two entities (User, Job) with cross-references via ObjectId refs. Users track `appliedJobs[]` and `savedJobs[]`, Jobs track `applicants[]` and `likes[]`.

## Development Workflows

### Running the Server
```bash
cd server
npm start  # Nodemon with hot-rtteload (runs server.js)
```

### Environment Setup (server/.env)
Required Auth0 config: `SECRET`, `BASE_URL`, `CLIENT_ID`, `ISSUER_BASE_URL`  
Required MongoDB: `MONGO_URI` (MongoDB Atlas connection string)  
Required CORS: `CLIENT_URL` (frontend origin for redirects)  
Optional: `PORT` (defaults to 8000)

### Route Auto-Discovery Mechanism
Routes are **dynamically imported** from `server/routes/` at startup:
```javascript
fs.readdirSync("./routes").forEach((file) => {
  import(`./routes/${file}`).then((route) => {
    app.use("/api/v1/", route.default);
  });
});
```
**Critical**: All route files must `export default router` - they're auto-prefixed with `/api/v1/`

## Code Conventions

### ES Modules (Strict)
- ALL files use `import/export` syntax (no CommonJS)
- `package.json` specifies `"type": "module"`
- **File extensions required**: `import User from "./models/UserModel.js"` (must include `.js`)

### Authentication Patterns

**Middleware**: `protect.js` checks `req.oidc.isAuthenticated()` before allowing access
```javascript
// Apply to protected routes (see jobRoutes.js)
router.post("/jobs", protect, createJob);
```

**Controller Pattern**: Fetch user from DB via Auth0 ID
```javascript
const user = await User.findOne({ auth0Id: req.oidc.user.sub });
```

**Auth Check Endpoint**: `GET /api/v1/check-auth` returns `{ isAuthenticated, user }` or `false`

### Error Handling
- Controllers use `express-async-handler` wrapper (see `jobController.js`)
- Controllers have **manual try-catch** blocks (async-handler used inconsistently)
- Return structured errors: `res.status(400).json({ message: "..." })`

### Mongoose Model Patterns
- Timestamps via `{ timestamps: true }` in all schemas
- ObjectId references use `ref: "ModelName"` for population
- Default exports: `export default mongoose.model("User", userSchema)`

## Key Components

### User Model (`models/UserModel.js`)
- `auth0Id` (unique): Primary identifier from Auth0's `sub` claim
- `role`: enum `["jobseeker", "recruiter"]` (default: `jobseeker`)
- `appliedJobs[]`, `savedJobs[]`: refs to Job model
- Optional fields: `resume`, `bio`, `profession`, `profilePicture`

### Job Model (`models/JobModel.js`)
- Required: `title`, `description`, `salary`, `jobType[]`, `skills[]`
- Arrays: `tags[]`, `applicants[]` (User refs), `likes[]` (User refs)
- `createdBy`: User ref (recruiter who posted job)
- `salaryType` default: `"Year"`, `negotiable` default: `false`

### Job Routes (`routes/jobRoutes.js`)
All routes protected except `GET /jobs` and `GET /jobs/search`:
- `POST /jobs` - Create job (requires `protect`)
- `GET /jobs/user/:id` - Get jobs by user ID
- `PUT /jobs/apply/:id` - Apply to job
- `PUT /jobs/like/:id` - Like/unlike job
- `DELETE /jobs/:id` - Delete job

### Controllers Logic
**jobController.js**: Manual validation before DB operations (checks for required fields, returns 400 if missing)  
**userController.js**: Lookup by `auth0Id` (not MongoDB `_id`)  
**Note**: `asycHandler` typo in userController (should be `asyncHandler`)

## Common Tasks

### Adding a New Route
1. Create file in `server/routes/` (e.g., `companyRoutes.js`)
2. Structure:
```javascript
import express from "express";
import { getCompanies } from "../controllers/companyController.js";
import protect from "../middleware/protect.js";

const router = express.Router();
router.get("/companies", protect, getCompanies);
export default router; // REQUIRED - auto-mounted to /api/v1/
```
3. Restart server (nodemon will auto-detect new file)

### Adding a New Model
1. Create in `server/models/` (e.g., `CompanyModel.js`)
2. Follow pattern:
```javascript
import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  // ... fields
}, { timestamps: true }); // Always include timestamps

export default mongoose.model("Company", companySchema);
```

### Working with Auth0 Users
**In routes/middleware**: Access via `req.oidc.user` (contains `sub`, `email`, `name`, `picture`)  
**In controllers**: Resolve to DB user via `User.findOne({ auth0Id: req.oidc.user.sub })`  
**Public profile lookup**: Use `/api/v1/user/:id` where `:id` is Auth0 ID (not MongoDB `_id`)

## Project Status

- **Frontend**: `client/` folder exists but is empty (no React/frontend code yet)
- **Database**: MongoDB Atlas cloud instance (connection string in `.env`)
- **Auth**: Auth0 fully configured with callback handling and user sync
- **API**: RESTful endpoints for jobs and users operational
