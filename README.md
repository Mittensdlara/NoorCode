# Norkode (نورکُد)

Norkode is a full-stack learning platform focused on Persian speaking developers. The project showcases a production-minded Next.js 14 application with a PostgreSQL database, NextAuth authentication, Prisma ORM and a fully local developer setup.

## Features

- 🌐 **Internationalised marketing site** with RTL/LTR toggle (English + Persian)
- 🔐 **Auth** with credential login, password hashing and role based access control (student, mentor, admin)
- 🧭 **Dashboards** for students and mentors with analytics, charts, assignments, schedule and messaging widgets
- 📚 **Course management** with lessons, assignments, comments and video uploads
- 📦 **Storage abstraction** (local disk + interface for S3 compatible providers)
- 🎬 **Video pipeline** with upload endpoint, processing queue simulation and progressive streaming
- 💬 **Realtime messaging** using a Socket.IO compatible server abstraction
- 🧪 **Testing stack** with Jest + Testing Library and Playwright examples
- 🐳 **Dockerfile** for containerised deployment

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- pnpm/yarn/npm

### Installation

```bash
cp .env.example .env
npm install
```

Update the values in `.env` as needed (the defaults assume everything runs on your laptop). At minimum ensure `DATABASE_URL` points to a reachable PostgreSQL instance.

### Run PostgreSQL locally

If you already have PostgreSQL 14+ installed you can skip this step. Otherwise the quickest option is to run it with Docker:

```bash
docker run --name norkode-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_DB=norkode \
  -p 5432:5432 \
  -d postgres:14
```

When the container is running you can confirm connectivity with `psql postgresql://postgres:postgres@localhost:5432/norkode`.

### Prepare the database & seed data

```bash
npm run prisma:migrate
npm run prisma:seed
```

### Start the app

The project needs the Next.js dev server **and** the Socket.IO dev server for realtime messaging. Run each one in its own terminal tab:

```bash
# Terminal 1 – Next.js
npm run dev

# Terminal 2 – Socket server
npx tsx scripts/socket-server.ts
```

Visit [http://localhost:3000](http://localhost:3000) and log in using one of the seeded accounts documented below. The Socket.IO server listens on [http://localhost:3001](http://localhost:3001) by default; adjust `SOCKET_SERVER_URL` in `.env` if you change the port.

### Seeded Users

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@norkode.dev | password123 |
| Mentor | mentor1@norkode.dev | password123 |
| Mentor | mentor2@norkode.dev | password123 |
| Student | student1@norkode.dev | password123 |
| Student | student2@norkode.dev | password123 |
| Student | student3@norkode.dev | password123 |
| Student | student4@norkode.dev | password123 |
| Student | student5@norkode.dev | password123 |
| Student | student6@norkode.dev | password123 |

### Tests

```bash
npm test
npm run test:e2e
```

> Playwright tests assume the dev server is running on port 3000 and the socket server on port 3001.

### Production Notes

- Replace the local disk storage implementation with an S3 compatible implementation by extending `server/storage/base.ts`.
- Provide real SMTP credentials for the email adapter in NextAuth.
- For realtime messaging at scale use a hosted service (e.g. Pusher). The project provides an abstraction in `server/realtime/socket.ts` to swap the driver easily.
- FFMPEG usage is feature-flagged with the `ENABLE_FFMPEG` variable. When disabled, thumbnails are seeded placeholders.

## Project Structure

```
app/                # Next.js App Router pages & API routes
components/         # Reusable UI components built with shadcn/ui primitives
lib/                # Utilities (RBAC helpers, formatting, intl, stores)
prisma/             # Prisma schema, migrations and seed data
public/             # Static assets and placeholder videos
server/             # Auth, storage, queue and realtime infrastructure
scripts/            # Automation scripts (husky hooks, socket dev server)
tests/              # Unit + e2e tests
```

## Conventions

- UI spacing uses an 8px scale and rounded-2xl corners to align with brand guidelines.
- Form inputs use `react-hook-form` + `zod` schemas located near the related route handler.
- API responses follow the `{ error: { code, message, details? } }` convention on failure.
- Middleware enforces RBAC for both server actions and API routes.

## Deployment Checklist

1. Configure environment variables for production services (S3, Pusher, SMTP).
2. Deploy PostgreSQL and run `npm run prisma:deploy`.
3. Build the project with `npm run build`.
4. Run the Socket.IO server (see `scripts/socket-server.ts`) alongside the Next.js server.

## License

MIT
