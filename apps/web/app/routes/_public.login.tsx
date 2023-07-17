import { Alert, Container, Paper, Stack, Text } from "@mantine/core";
import type { LoaderArgs } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { useLocation, useOutletContext } from "@remix-run/react";
import { IconAlertCircle } from "@tabler/icons-react";
import {
  GoogleLoginButton,
  MicrosoftLoginButton,
} from "react-social-login-buttons";

import { signInWithAzure, signInWithGoogle } from "../auth";
import { DEFAULT_PATH } from "../config";
import { createServerClient, getSupabaseEnv } from "../db";
import type { SupabaseOutletContext } from "../root";

export const loader = async ({ context, request }: LoaderArgs) => {
  const { supabase } = createServerClient(getSupabaseEnv(context), request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return redirect(DEFAULT_PATH);
  return null;
};

export default function Login() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  const params = new URLSearchParams(useLocation().search);
  const googleLogin = async () => {
    if (!supabase) return;
    await signInWithGoogle(supabase, `${location.origin}/login/callback`);
  };
  const azureLogin = async () => {
    if (!supabase) return;
    await signInWithAzure(supabase, `${location.origin}/login/callback`);
  };

  return (
    <Container size="xs" p="sm">
      <Stack mt="lg">
        <Paper>
          <Stack>
            <GoogleLoginButton onClick={googleLogin}>
              Sign in with Google
            </GoogleLoginButton>
            <MicrosoftLoginButton onClick={azureLogin}>
              Sign in with Microsoft
            </MicrosoftLoginButton>
          </Stack>
        </Paper>
        {params.has("error") && (
          <Alert
            icon={<IconAlertCircle size="1rem" />}
            title="Sign in failed"
            color="red"
          >
            <Text mt="md">{params.get("error")}</Text>
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
