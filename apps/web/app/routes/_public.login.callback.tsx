import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

import { completeSignIn } from "../auth";
import { DEFAULT_PATH } from "../config";
import { createServerClient, getSupabaseServiceEnv } from "../db";

export const loader = async ({ context, request }: LoaderArgs) => {
  let response: Response | undefined;
  try {
    let supabaseAdmin;
    ({ response, supabase: supabaseAdmin } = createServerClient(
      getSupabaseServiceEnv(context),
      request
    ));
    await completeSignIn(request, supabaseAdmin);
    return redirect(DEFAULT_PATH, {
      status: 303,
      headers: response.headers,
    });
  } catch (error) {
    console.error(error);
    const params = new URLSearchParams();
    params.append(
      "error",
      error instanceof Error ? error.message : "Unknown error"
    );
    return redirect(`/login?${params.toString()}`, {
      status: 303,
      headers: response?.headers ?? {},
    });
  }
};
