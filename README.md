# Remix + Supabase + Cloudflare starter

A highly opinionated full-stack starter monorepo.

- Package management: [pnpm](https://pnpm.io/)
- Build system: [Turborepo](https://turbo.build/)
- CI/CD: [GitHub Actions](https://github.com/features/actions)
- Language: [Typescript](https://www.typescriptlang.org/)
- Web: [Remix](https://remix.run/)
- UI: [Mantine](https://mantine.dev/) (using [v7 alpha](https://v7.mantine.dev/getting-started) since the switch to static CSS works better with SSR)
- DB: [Supabase](https://supabase.com/)
- Hosting: [Cloudflare Pages](https://pages.cloudflare.com/)
- Server runtime: [Cloudflare Workers](https://workers.cloudflare.com/)

## After forking

You'll want to rename the `@resupaflare` scope to something matching your
project:

```bash
git grep -l '@resupaflare' | xargs sed -i '' -e 's/@resupaflare/@NEW_SCOPE/g'
```

## Local setup

1. [Install pnpm](https://pnpm.io/installation)
1. [Install pgFormatter](https://github.com/darold/pgFormatter) (on MacOS: `brew install pgformatter`)
1. `pnpm install`
1. Create `.env.development.local` and add the required variables from
   `.env.development`
1. `pnpm dlx supabase link --project-ref PROJECT_ID`

## Local dev

`pnpm dev`

### Updating DB types

After making local changes to the DB, run `pnpm gen-types`. This generates
`packages/db/src/types.ts`, which should be checked in with the changes.

### Generating a migration

Migrations are applied by GitHub Actions. Generate a migration using `pnpm
gen-migration MIGRATION_NAME` and include it with the relevant change.

## Updating Remix

Remix is patched to fix the sourcemap path escaping for Cloudflare functions.

To update the patch for a new Remix version:

1. `pnpm patch @remix-run/dev@[VERSION]`
1. Edit `[TMP_PATH]/dist/compiler/server/write.js` (see the previous diff for the change).
1. `pnpm patch-commit [TMP_PATH]`

## Hosting setup

### Cloudflare

1. Create a new Pages application with the following settings:
   1. Build command: `pnpm run build:web`
   1. Build output directory: `/apps/web/public`
   1. Root directory: `/`

### Supabase

Create two projects, one for production and the other for staging.

### GitHub Actions

1. Add `SUPABASE_PROJECT_ID` as a GitHub Actions environment variable
1. [Generate a Supabase access token](https://supabase.com/dashboard/account/tokens)
1. Add `SUPABASE_ACCESS_TOKEN` as a GitHub Actions repo secret
1. Add `SUPABASE_DB_PASSWORD` as a GitHub Actions environment secret
