import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";

import { completeSignIn } from "../auth";
import { DEFAULT_PATH } from "../config";
import { createServerAdminClient } from "../db";

export const loader = async ({ context, request }: LoaderArgs) => {
  try {
    const supabaseAdmin = createServerAdminClient(context);
    await completeSignIn(request, supabaseAdmin);
    return redirect(DEFAULT_PATH, {
      status: 303,
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
    });
  }
};
