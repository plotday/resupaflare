# Remix + Cloudflare + Supabase starter

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

[] Mantine
[] Supabase
[] Cloudflare Function
[] lint with githook
