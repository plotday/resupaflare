import type { AppLoadContext } from "@remix-run/cloudflare";
import * as z from "zod";

const environmentSchema = z.object({
  SUPABASE_URL: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
  SENTRY_DSN: z.string().optional(),
});

export type Environment = z.infer<typeof environmentSchema>;

export const getEnv = (context: AppLoadContext) =>
  environmentSchema.parse(context.env);

export const getBrowserEnv = (context: AppLoadContext) => {
  const { SUPABASE_URL, SUPABASE_ANON_KEY, SENTRY_DSN } = getEnv(context);
  return { SUPABASE_URL, SUPABASE_ANON_KEY, SENTRY_DSN };
};
