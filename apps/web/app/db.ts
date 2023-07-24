import type { AppLoadContext } from "@remix-run/cloudflare";
import type { Database } from "@resupaflare/db";
import { createServerClient as createServerClientHelper } from "@supabase/auth-helpers-remix";
import { createClient } from "@supabase/supabase-js";

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

export const createServerClient = (
  request: Request,
  context: AppLoadContext
) => {
  const response = new Response();
  const supabase = createServerClientHelper<Database>(
    getEnv(context).SUPABASE_URL,
    getEnv(context).SUPABASE_ANON_KEY,
    {
      request,
      response,
      cookieOptions,
    }
  );
  return { response, supabase };
};

export const createServerAdminClient = (context: AppLoadContext) => {
  const supabaseAdmin = createClient<Database>(
    getEnv(context).SUPABASE_URL,
    getEnv(context).SUPABASE_SERVICE_KEY
  );
  return supabaseAdmin;
};
