# Shubhdeep Technosoft — Website + Admin & Employee Dashboards

Your existing website (`index.html`, `login.html`, `register.html`) with a **built-in admin panel and employee dashboard**, backed by a Node.js/Express + MongoDB API. Same site, no separate app.

```
shubhdeep-site/
├── backend/     Node.js + Express + MongoDB API (cookie-based JWT auth)
└── frontend/    Your original site + new admin-dashboard.html / employee-dashboard.html
```

## What was added to your files

- **`assets/js/config.js`** *(new)* — one place to set the backend URL (`ST_API_BASE`).
- **`assets/js/session.js`** *(new)* — checks login state on every page; shows the logged-in user's **name in the navbar** on `index.html` (with a Dashboard link + Logout), and guards the two dashboard pages.
- **`assets/js/auth.js`** *(your file, lightly patched)* — now redirects straight to `admin-dashboard.html` or `employee-dashboard.html` after login, based on role.
- **`admin-dashboard.html` + `assets/js/admin.js`** *(new)* — the admin panel.
- **`employee-dashboard.html` + `assets/js/employee.js`** *(new)* — the employee panel.
- **`assets/css/dashboard.css`** *(new)* — styling for both dashboards, reusing your existing design tokens from `style.css`.
- `index.html`, `login.html`, `register.html` — untouched except adding the two `<script>` includes above.

## Quick Start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set:
- `MONGODB_URI` — your local or Atlas connection string
- `CLIENT_URL` — **the exact origin your frontend is served from** (e.g. `http://127.0.0.1:5500` if using VS Code Live Server). This must match exactly or the login cookie won't be accepted.
- `JWT_SECRET` — any long random string

```bash
npm run seed     # creates the first admin account + 2 sample employees + sample tasks
npm run dev       # http://localhost:5001
```

The seed script prints login credentials to the console, e.g.:
```
admin@shubhdeeptechnosoft.com / Admin@12345
arjun@shubhdeeptechnosoft.com / Employee@123
divya@shubhdeeptechnosoft.com / Employee@123
```

### 2. Frontend

Serve the `frontend` folder with any static server (must **not** be opened as a `file://` URL, since cookies require a real origin):

```bash
cd frontend
npx serve -l 5500
# or VS Code "Live Server" extension, or: python3 -m http.server 5500
```

Then open `http://127.0.0.1:5500` (make sure this matches `CLIENT_URL` in the backend `.env`).

## How it works

**Login/registration** — `login.html` and `register.html` already called a backend at `/api/auth/*`; that backend now exists and matches exactly what your `auth.js` expects (cookie-based session, `{ user: { name, email, role } }` response shape).

**Confirming login on the main page** — `session.js` runs on `index.html`, calls `GET /api/auth/me`, and if logged in, replaces the Login/Get Started buttons with the user's name + avatar (dropdown with Dashboard/Logout links).

**Admin dashboard** (`admin-dashboard.html`) — opens automatically after an admin logs in. Includes:
- **Overview** — employee count, today's tasks, completions, attendance at a glance
- **Employees** — add employee (name, email, phone, position, department, temp password), table showing phone, position, today's attendance, today's task progress, deactivate
- **Tasks** — assign a task with a **daily goal**, priority and date to any employee; filter by status; delete
- **Attendance** — mark present/absent/half-day/leave per employee for today; recent attendance log

**Employee dashboard** (`employee-dashboard.html`) — opens automatically after an employee logs in. Includes:
- **My Tasks** — today's assigned tasks with daily goals; one tap to advance status (pending → in-progress → completed)
- **My Profile & Activity** — profile details, 30-day completion rate, attendance history, task history

All of this is stored in MongoDB across three collections: `users` (login + employee profile in one), `tasks` (daily goal + status), `attendance`.

## Verified

- All backend files pass `node --check` and were confirmed to **import/resolve with zero errors** (`npm install` succeeded, module graph loads cleanly).
- All new frontend JS files pass `node --check`.
- Every DOM element ID referenced in `admin.js` / `employee.js` was cross-checked against its HTML file — no mismatches.
- **Not tested against a live MongoDB instance** (none available in this sandbox) — you'll need to point `MONGODB_URI` at a real database and run through the flows once yourself. If anything doesn't line up, send me the exact error and I'll fix it.

## Notes / things you may want to adjust

- **Public registration** (`register.html`) always creates an `employee` account. There's no public admin signup — the first admin comes from `npm run seed`. You can promote someone to admin later by editing their `role` field directly in MongoDB.
- Passwords must be **8+ characters** (matches your existing `register.html` validation).
- If you deploy the frontend and backend to different domains in production, set `NODE_ENV=production` in the backend so cookies are sent with `Secure; SameSite=None` (required for cross-site cookies over HTTPS).
