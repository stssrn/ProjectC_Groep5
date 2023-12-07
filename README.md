# Antes Onboarding App

## Development

First, make sure that the environment variables for the Postgres database are inside `frontend/.env`.

To generate Typescript types from the Prisma schema run:

```sh
cd frontend
pnpx prisma generate
```

To run the dev server run:

```sh
cd frontend
pnpm dev
```

To seed the database run:

```sh
npx prisma db seed
```

> [!WARNING]
> Do **not** run `pnpx prisma db seed` because it doesn't work pnpm/pnpm#6464. Use `npx`!

## Building

To build the app run:

```sh
cd frontend
pnpm build
```
