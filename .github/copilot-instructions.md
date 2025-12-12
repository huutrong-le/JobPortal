# Copilot Instructions for JobPortal

## Architecture Overview

This is a MERN-based job portal with Auth0 authentication. The project has a **monorepo structure** with separate `client/` (currently empty) and `server/` directories.

**Server Stack**: Express.js (ES Modules), MongoDB (Mongoose), Auth0 (express-openid-connect)

**Key Flow**: Auth0 handles authentication → users are synced to MongoDB → API routes handle business logic

## Critical Setup & Development

### Running the Server
```bash
cd server
npm start  # Uses nodemon for hot-reload
```

### Environment Variables (server/.env)
Required variables:
- `SECRET`, `BASE_URL`, `CLIENT_ID`, `ISSUER_BASE_URL` - Auth0 configuration
- `MONGO_URI` - MongoDB connection string (currently MongoDB Atlas)
- `CLIENT_URL` - Frontend origin for CORS and redirects
- `PORT` - Server port (default: 8000)

**Note**: `.env` file contains actual credentials and should NOT be committed to git.

## Code Patterns & Conventions

### ES Modules (Not CommonJS)
- Use `import/export` syntax throughout
- `package.json` has `"type": "module"`
- File extensions required in imports: `import connect from "./db/connect.js"`

### Route Auto-Discovery
Routes are **dynamically loaded** from `server/routes/` using filesystem scanning:
```javascript
fs.readdirSync("./routes").forEach((file) => {
  import(`./routes/${file}`).then((route) => {
    app.use("/api/v1/", route.default);
  });
});
```
**Important**: All route files must export a router as `default` and are prefixed with `/api/v1/`

### Auth0 Integration Pattern
- `express-openid-connect` middleware provides `req.oidc` object
- Check authentication: `req.oidc.isAuthenticated()`
- Access user: `req.oidc.user` (contains `sub`, `email`, `name`, `picture`)
- Root route (`/`) handles Auth0 callback and syncs users to MongoDB via `enusureUserInDB()`

### User Model & Roles
- Users have two roles: `"jobseeker"` (default) or `"recruiter"`
- `auth0Id` field stores Auth0's `sub` claim (unique identifier)
- User schema includes job references: `appliedJobs[]`, `savedJobs[]` (both ref to `Job` model)
- Auto-timestamps enabled via `{ timestamps: true }`

### Error Handling
- Uses `express-async-handler` for async route handlers
- Avoids try-catch boilerplate in routes

## Common Tasks

### Adding New Routes
1. Create file in `server/routes/` (e.g., `jobRoutes.js`)
2. Export Express router as default:
   ```javascript
   import express from "express";
   const router = express.Router();
   router.get("/jobs", (req, res) => { /* ... */ });
   export default router;
   ```
3. Auto-loaded on server restart (no manual registration needed)

### Adding New Models
1. Create in `server/models/` following Mongoose schema pattern
2. Export model: `export default mongoose.model("ModelName", schema)`
3. Import where needed (see `UserModel.js` for reference)

### Checking Auth in Routes
```javascript
if (req.oidc.isAuthenticated()) {
  const user = req.oidc.user; // Auth0 user object
  // Your logic here
}
```

## Known Issues & Notes

- **Missing Server Call**: The `server()` function is defined but called at line 101 - ensure this line exists
- **Client folder is empty**: Frontend not yet implemented
- **CORS configured** for `CLIENT_URL` with credentials support
- **MongoDB connection**: Uses Mongoose with basic error handling in `db/connect.js`
