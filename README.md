# JobTracker

A Kanban-style job application tracker with automated follow-up reminders and a stats dashboard.

**Live demo:** <https://your-app.vercel.app>
**API docs:** <https://your-api.onrender.com/docs>

![Demo](docs/demo.gif)

---

## Why I built this

I'm job hunting, and my applications were scattered across email, spreadsheets, and notes. I kept missing follow-ups and had no idea which stage I was losing most applications at. So I built the tool I wanted.

## Features

- Sign up and log in (JWT auth), each user sees only their own data
- Kanban board: Applied → Online Assessment → Interview → Offer / Rejected
- Drag-and-drop cards between stages
- Per-application notes, links, salary range, and contact details
- Email reminders for follow-ups (scheduled cron job)
- Stats dashboard: response rate, average days per stage, applications per week
- Responsive layout, works on mobile

## Tech stack

| Layer      | Choice                          |
|------------|---------------------------------|
| Frontend   | React, Vite, Tailwind CSS       |
| Backend    | Node.js + Express (or FastAPI)  |
| Database   | PostgreSQL                      |
| Auth       | JWT, bcrypt                     |
| Scheduler  | node-cron (or APScheduler)      |
| Email      | Resend / SendGrid               |
| Testing    | Jest + Supertest (or pytest)    |
| CI/CD      | GitHub Actions                  |
| Hosting    | Vercel (frontend), Render (API + DB) |

## Architecture

```
[React UI] --> [REST API] --> [PostgreSQL]
                   |
              [Cron worker] --> [Email service]
```

## Project structure

```
JobTracker/
├── backend/        # API, auth, cron jobs
├── frontend/       # React app
├── docs/           # screenshots, diagrams
├── .github/
│   └── workflows/  # CI pipeline
├── .env.example
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### Setup

```bash
git clone https://github.com/Blodreina912/JobTracker.git
cd JobTracker
```

**Backend**

```bash
cd backend
cp .env.example .env     # fill in your values
npm install
npm run migrate
npm run dev
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`, the API at `http://localhost:4000`.

### Environment variables

| Variable        | Description                      |
|-----------------|----------------------------------|
| `DATABASE_URL`  | PostgreSQL connection string     |
| `JWT_SECRET`    | Secret used to sign tokens       |
| `EMAIL_API_KEY` | Key for the email provider       |
| `CLIENT_URL`    | Frontend URL (for CORS)          |

## API overview

| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/auth/signup`          | Create an account         |
| POST   | `/auth/login`           | Get a JWT                 |
| GET    | `/applications`         | List your applications    |
| POST   | `/applications`         | Add an application        |
| PATCH  | `/applications/:id`     | Update details or stage   |
| DELETE | `/applications/:id`     | Remove an application     |
| GET    | `/stats`                | Dashboard numbers         |

## Testing

```bash
cd backend && npm test
```

## Decisions I made

- **PostgreSQL over MongoDB:** the data is relational (users, applications, stage history), and I wanted real joins for the stats queries.
- **JWT in httpOnly cookies:** safer against XSS than localStorage.
- **Stage history table:** every move between stages is stored with a timestamp, which is what makes "average days per stage" possible.
- **Cron over a queue:** reminders are low volume, so a simple scheduled job beats the extra infrastructure of a message queue.

## Roadmap

- [x] Auth
- [ ] Kanban board
- [ ] Reminders
- [ ] Stats dashboard
- [ ] Deployment
- [ ] CSV import/export
- [ ] Browser extension to save jobs from LinkedIn

## What I learned

Fill this in as you build. Two or three honest lines about what was hard and how you solved it.

## License

MIT

## Author

**Blodreina912**
GitHub: [@Blodreina912](https://github.com/Blodreina912)
