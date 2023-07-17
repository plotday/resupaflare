import type { AppLoadContext } from "@remix-run/cloudflare";
import * as z from "zod";

const environmentSchema = z.object({
  SUPABASE_URL: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1),
});

export type Environment = z.infer<typeof environmentSchema>;

export const getEnv = (context: AppLoadContext) =>
  environmentSchema.parse(context.env);
