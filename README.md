# Prerequisites

1. [Docker](https://docs.docker.com/get-docker/)
2. [Yarn](https://yarnpkg.com/)

# Setup

1. Spin up DB (see section below)
2. Rename `example.env` to `.env` and populate env vars
3. Spin up NextJS project (frontend/backend)

---

# Database

## Setup

Spin up the database by running `docker compose up`. Credentials are in `docker-compose.yml`

## Prisma ORM

- [Prisma](www.prisma.io/docs/)

Whenever you make changes to your Prisma schema in the future, you manually need to invoke `yarn prisma generate` in order to accommodate the changes in your Prisma Client API.

### DB Migrations

Create a migration from changes in Prisma schema, apply it to the database, trigger generators (e.g. Prisma Client)

```sh
$ yarn prisma migrate dev
```

---

# Frontend

```sh
$ cd frontend
$ yarn
$ yarn dev
```

# Backend

We're using [NextJS's API Routes](https://nextjs.org/docs/api-routes/introduction) for our backend
