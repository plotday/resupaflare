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

## Getting started

You'll likely want to duplicate this repo, rather than forking it:

```bash
# First, create a blank NEW_REPO on GitHub.

# Make a bare clone
git clone --bare https://github.com/PlotTech/resupaflare.git
cd resupaflare.git
git push --mirror https://github.com/USERNAME/NEW_REPO.git
cd ..
rm -rf resupaflare

# Clone the new repo
git clone https://github.com/USERNAME/NEW_REPO.git
cd NEW_REPO
git remote add resupaflare https://github.com/PlotTech/resupaflare.git
git grep -l '@resupaflare' | xargs sed -i '' -e 's/@resupaflare/@NEW_SCOPE/g'
git commit -am "Set package scope"
git push origin master
```

## Updating

To pull the latest changes from this repo into your new repo:

```bash
git pull resupaflare main
git push origin main
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
`libs/db/src/types.ts`, which should be checked in with the changes.

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

1.[Generate a Supabase access token](https://supabase.com/dashboard/account/tokens)
2. Add these organization or repo secrets:
   1. `SUPABASE_ACCESS_TOKEN`
   2. `CLOUDFLARE_API_TOKEN`
   3. `SENTRY_AUTH_TOKEN`
4. Create `staging` and `production` environments
5. Add environment secrets
   1. `SUPABASE_DB_PASSWORD`
6. Add environment variables
   1. `DEPLOY_ENV`
   2. `SUPABASE_PROJECT_ID`
