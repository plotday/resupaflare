import { SupabaseClient } from "@supabase/supabase-js";

// Process an Oauth callback and create a session
export const completeSignIn = async (
  request: Request,
  supabaseAdmin: SupabaseClient
) => {
  const url = new URL(request.url);
  if (url.searchParams.has("error")) {
    if (url.searchParams.has("error_description")) {
      throw Error(url.searchParams.get("error_description") as string);
    } else {
      throw Error("Auth provider error");
    }
  }
  const code = url.searchParams.get("code");
  if (typeof code !== "string") throw Error("Missing auth code");

  const { data, error } = await supabaseAdmin.auth.exchangeCodeForSession(code);
  if (error) throw error;

  if (!data?.session) {
    throw Error("No session");
  }

  return data?.session;
};

export const signInWithGoogle = async (
  supabase: SupabaseClient,
  redirectTo: string,
  additionalScopes?: string[]
) => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      scopes: (additionalScopes || []).join(" "),
      queryParams: {
        access_type: additionalScopes ? "offline" : "online",
        prompt: (additionalScopes ? ["select_account", "consent"] : []).join(
          " "
        ),
      },
    },
  });
};

export async function signInWithAzure(
  supabase: SupabaseClient,
  redirectTo: string,
  additionalScopes?: string[]
) {
  await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      redirectTo,
      scopes: ["openid", "email", "user.read"]
        .concat(additionalScopes || [])
        .join(" "),
    },
  });
}
