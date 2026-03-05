# Wordle - Bunny Edge Scripting

A simple Wordle clone running on [Bunny Edge Scripting](https://bunny.net).

## How it works

The entire game is served from a single edge function (`src/main.ts`):

- **GET /** serves the HTML/CSS/JS game UI
- **POST /api/new** picks a random 5-letter word and returns an encoded token
- **POST /api/guess** validates a guess against the token and returns per-letter feedback

The server is fully stateless. The word is encoded in a client-held token and all game history is stored in `localStorage`, so sessions survive server restarts and page refreshes.

## Setup

Requires [Deno](https://docs.deno.com/runtime/manual/getting_started/installation/).

```sh
# Run locally
deno task dev

# Lint & type check
deno task lint
deno task check

# Build for deployment
deno task build
```

Open http://127.0.0.1:8080 to play.

## Deployment

Pushes to `main` auto-deploy to Bunny via the [on-merge workflow](./.github/workflows/on-merge.yml).

## Changeset

This project uses [changeset](https://github.com/changesets/changesets) for version management:

```sh
pnpm changeset        # describe your changes
pnpm changeset version # bump version
```
