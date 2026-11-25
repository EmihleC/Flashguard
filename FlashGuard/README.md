# FlashGuard Student Handoff Guide

This repository contains the student system under test:

- Web application
- Mobile application (Expo for Android/iOS)
- API service
- SQL Server schema and seed scripts

## 1) Prerequisites

- Node.js 18+ for the Docker API; Node.js 22+ for the Windows Authentication API
- Docker Desktop (Compose enabled)
- SQL Server running on the host machine (default: localhost:1433)
- ODBC Driver 18 for SQL Server for Windows Authentication mode

## 2) First-Time Setup

1. Copy the environment template.

```bash
cp .env.example .env
```

2. Choose the database authentication mode before starting the API.

### Windows Authentication (no SQL password)

Use this mode when your Windows account has access to the local SQL Server. The API must run directly on Windows; the Docker API container cannot use your Windows login.

1. Keep `DB_HOST=localhost` in `.env`. Remove any `DB_USER` or `DB_PASSWORD` entries; the Windows-auth start command selects this mode.
2. Install API dependencies with `npm --prefix api install`.
3. If the FlashGuard database has not been initialized, run `npm run db:init-local`. This resets and reseeds its data.
4. If the Docker API container is running, stop it with `docker compose stop api`.
5. Start the API on Windows:

```bash
npm run api:start:windows-auth
```

The API uses the current Windows account via the installed SQL Server ODBC driver. To start the local stack in one command, run `npm run stack:up:local`. It stops the Docker API, starts the web/mobile containers, resets and reseeds the database, and starts the API on Windows. The seed resets database records. Leave the terminal running.

To run the Playwright browser cases from a second PowerShell terminal in `FlashGuard`, use Windows authentication for SQL queries and run the tagged spec:

```powershell
$env:DB_AUTH = "windows"
npm run test:e2e -- tests/e2e/step_definition/TC-E2E-001.scenario1.spec.ts
```

Run all Playwright cases with `npm run test:e2e`. The stack must be running; these cases use the web app on port 3000 and API on port 4000.

To run the concurrent-transfer scenario, use a second terminal and run `npm --prefix "tests/e2e/Concurrent  Transfers" run test:concurrency` from `FlashGuard`. That scenario requires Alice's balance to be exactly R100; the default seed sets it to R10000, so adjust the test account balance after seeding.

The Android development build also needs Metro. In another terminal, run `npm --prefix mobile run start` from `FlashGuard`, then press `a` in the Expo terminal to open the app on the emulator. If the emulator cannot reach Metro, run `adb reverse tcp:8081 tcp:8081`. Keep Metro running while the test executes.

To run the mobile Alice-to-Bob R50 case, keep the API, Metro, emulator, and Appium running, then set the Expo Go capabilities and run:

```powershell
$env:APP_PACKAGE = "host.exp.exponent"
$env:APP_ACTIVITY = ".experience.ExperienceActivity"
npm --prefix "tests/e2e/Concurrent  Transfers" run test:mobile-transfer
```

The test taps **Review Transaction**, verifies the transfer, authorizes it through the test API, then checks Alice's and Bob Wallet's balances. Alice must have at least R50 available.

### Docker SQL Authentication

The Docker API path requires SQL Server Authentication credentials in `.env` (`DB_USER` and `DB_PASSWORD`). Start it with `npm run stack:up:containers`.

## 3) Service Endpoints

- Web app: http://localhost:3000
- Mobile-facing container UI: http://localhost:3001
- API base URL: http://localhost:4000
- API health check: http://localhost:4000/health

Notes:

- The Expo mobile app uses Android host mapping `10.0.2.2:4000` when running in an emulator.
- API and web/mobile containers are started via Docker Compose.

Container notes:

- Containers expose services on their internal container ports (the web and mobile images serve on port `80` inside the container).
- Docker Compose maps those container ports to host ports using the `WEB_PORT`, `MOBILE_PORT`, and `API_PORT` variables in `.env` (defaults: `WEB_PORT=3000`, `MOBILE_PORT=3001`, `API_PORT=4000`).
- When the stack starts you may see services listening on the container port (e.g. `:80`) in container logs; access them from your host using the mapped host ports above (for example `http://localhost:3000` for the web UI).
- Android emulators access the host machine via `10.0.2.2`, so mobile/emulator tests should target `http://10.0.2.2:${API_PORT}` or `http://10.0.2.2:${MOBILE_PORT}`.

## 4) Common Commands

- Start full Docker stack and Expo prompt (requires SQL Server Authentication credentials):

```bash
npm run stack:up
```

- Start Docker containers and seed only (requires SQL Server Authentication credentials):

```bash
npm run stack:up:containers
```

- Reset seed data:

```bash
npm run db:reset-seed
```

- View logs:

```bash
npm run stack:logs
```

- Stop and remove containers/volumes:

```bash
npm run stack:down
```

- API health check:

```bash
npm run api:health
```

## 5) API Endpoints (Core Student Flows)

- POST /auth/login
- POST /auth/register
- POST /auth/logout
- GET /accounts
- GET /accounts/:id/balance
- GET /transactions/history
- GET /transactions/pending
- POST /transactions/transfer
- POST /transactions/transfer/:id/authorize
- GET /alerts
- GET /health

## 6) Documentation Index

Project documentation lives in the `docs` folder:

- docs/Student-Quickstart.md
- docs/Offline-Runbook.md
- docs/Coverage-Analysis.md
- docs/Submission-Checklist.md

## 7) Your Test Framework

The `tests/` folder (`ui`, `api`, `db`, `mobile`, `e2e`) is intentionally empty. Build your automation framework, CI/CD pipeline, RTM and Test Strategy as described in the capstone brief.

## 8) Troubleshooting

- SQL login failure: verify `DB_USER` and `DB_PASSWORD` in `.env` match a real SQL login on your host SQL Server.
- API unavailable: run `npm run stack:logs` and check the `api` service output.
- Android emulator cannot reach API: use `http://10.0.2.2:4000` from the app/emulator context.
