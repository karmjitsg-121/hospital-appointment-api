# Hospital Appointment API

Node.js, TypeScript, PostgreSQL, and Prisma 7 CRUD example for patients, doctors, and appointments.

## Setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` for the `hospital_api` database.
2. Install dependencies with `npm install`.
3. Introspect the existing database with `npx prisma db pull`.
4. Validate and generate Prisma Client with `npx prisma validate` and `npx prisma generate`.

The database URL is configured in `prisma.config.ts`, as required by Prisma 7. It is intentionally absent from `prisma/schema.prisma`.

## Seed and test

Run `npx prisma db seed` to create two doctors, two patients, and two appointments. Run `npx ts-node src/test.ts` to exercise the CRUD functions and relations.