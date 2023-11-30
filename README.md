# Antes Onboarding App

## Development

First, make sure that the environment variables are inside `frontend/.env`.

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

## Building

To build the app run:

```sh
cd frontend
pnpm build
```