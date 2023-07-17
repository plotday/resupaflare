import type { Database } from "@resupaflare/db";
import { createServerClient as createSupabaseClient } from "@supabase/auth-helpers-remix";

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
  supabaseUrl: string,
  supabaseKey: string,
  request: Request
) => {
  const response = new Response();
  const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseKey, {
    request,
    response,
    cookieOptions,
  });
  return { response, supabase };
};
