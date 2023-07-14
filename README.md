# Remix + Supabase + Cloudflare starter

A highly opinionated full-stack starter monorepo.

- Package management: [pnpm](https://pnpm.io/)
- Build system: [Turborepo](https://turbo.build/)
- CI/CD: [GitHub Actions](https://github.com/features/actions)
- Language: [Typescript](https://www.typescriptlang.org/)
- Web: [Remix](https://remix.run/)
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
1. `pnpm install`

## Hosting setup

### Cloudflare

1. Create a new Pages application with the following settings:
   1. Build command: `pnpm run build:web`
   1. Build output directory: `/apps/web/public`
   1. Root directory: `/`

## Local dev

`pnpm dev`

## Patching

Remix is patched to fix the sourcemap path escaping for Cloudflare functions.

To update the patch for a new Remix version:

1. `pnpm patch @remix-run/dev@[VERSION]`
1. Edit `[TMP_PATH]/dist/compiler/server/write.js` (see the previous diff for the change).
1. `pnpm patch-commit [TMP_PATH]`

## TODO

- [] Mantine
- [] Supabase
- [] Cloudflare Worker
- [] tests
- [] Sentry
