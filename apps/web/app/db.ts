import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Database } from "@resupaflare/db";
import { createServerClient as createSupabaseClient } from "@supabase/auth-helpers-remix";

import { getEnv } from "./env";

export { safeQuery } from "@resupaflare/db";

export type { Database } from "@resupaflare/db";

export const cookieOptions = {
  name: "dda",
  lifetime: 60 * 60 * 8,
  maxAge: 60 * 60 * 8,
  sameSite: false,
  secure: false,
  domain: "",
  path: "/",
};

export const getSupabaseEnv = (context: AppLoadContext) => ({
  url: getEnv(context).SUPABASE_URL,
  key: getEnv(context).SUPABASE_ANON_KEY,
});

export const getSupabaseServiceEnv = (context: AppLoadContext) => ({
  url: getEnv(context).SUPABASE_URL,
  key: getEnv(context).SUPABASE_SERVICE_KEY,
});

export const createServerClient = (
  supabaseConfig: { url: string; key: string },
  request: Request
) => {
  const response = new Response();
  const supabase = createSupabaseClient<Database>(
    supabaseConfig.url,
    supabaseConfig.key,
    {
      request,
      response,
      cookieOptions,
    }
  );
  return { response, supabase };
};
