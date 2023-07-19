import { Button, Container, Title } from "@mantine/core";
import { useOutletContext } from "@remix-run/react";
import { useCallback } from "react";

import { APP_NAME } from "../config";
import type { SupabaseOutletContext } from "../root";

export default function Index() {
  const { user, supabase } = useOutletContext<SupabaseOutletContext>();
  const logout = useCallback(() => {
    if (!supabase) return;
    supabase.auth.signOut();
  }, [supabase]);

  return (
    <Container>
      <Title>Welcome to {APP_NAME}</Title>
      {!user && (
        <Button component="a" href="/login">
          Sign in
        </Button>
      )}
      {user && <Button onClick={logout}>Sign out</Button>}
      <Button
        onClick={() => {
          throw Error("Boom!");
        }}
      >
        Blow up
      </Button>
      <ul>
        <li>
          <a href="https://remix.run/">Remix</a>
        </li>
        <li>
          <a href="https://v7.mantine.dev/getting-started">Mantine v7</a>
        </li>
        <li>
          <a href="https://supabase.com/">Supabase</a>
        </li>
      </ul>
    </Container>
  );
}
