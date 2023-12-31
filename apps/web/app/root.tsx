import {
  ColorSchemeScript,
  Container,
  MantineProvider,
  Text,
  Title,
} from "@mantine/core";
import "@mantine/core/styles.css";
import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRevalidator,
  useRouteError,
} from "@remix-run/react";
import type { Database } from "@resupaflare/db";
import type { User } from "@supabase/auth-helpers-remix";
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useEffect, useMemo } from "react";

import { APP_NAME } from "./config";
import { cookieOptions, createServerClient } from "./db";
import { getBrowserEnv, getEnv } from "./env";
import {
  Sentry,
  SentryClientInit,
  SentryServerInit,
  captureRemixErrorBoundaryError,
} from "./sentry";

export const loader = async ({ context, request }: LoaderArgs) => {
  const env = getEnv(context);
  if (env.SENTRY_DSN) SentryServerInit(env.SENTRY_DSN, request);

  const { response, supabase } = createServerClient(request, context);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user && Sentry) Sentry.setUser({ id: user.id, email: user.email });

  return json(
    {
      env: getBrowserEnv(context),
      session,
      user,
    },
    {
      headers: response.headers,
    }
  );
};

export type SupabaseOutletContext = {
  supabase?: SupabaseClient<Database>;
  user?: User;
};

export const meta: V2_MetaFunction = () => {
  return [{ title: APP_NAME }];
};

export const links: LinksFunction = () => [
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

function Page({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </MantineProvider>
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let message;
  if (isRouteErrorResponse(error)) {
    title = "Page not found";
  } else {
    captureRemixErrorBoundaryError(error);
    if (error instanceof Error) {
      if (error.stack) {
        message = error.stack;
      } else {
        message = error.message;
      }
    } else if (typeof error === "string") {
      message = error;
    } else if (
      error &&
      typeof error === "object" &&
      "message" in error &&
      typeof error.message === "string"
    ) {
      message = error.message;
    } else {
      message = "Unknown error";
    }
  }
  return (
    <Page>
      <Container mt="xl">
        <Title mb="md">{title}</Title>
        <Text>{message}</Text>
      </Container>
    </Page>
  );
}

export default function App() {
  const { env, user, session } = useLoaderData<typeof loader>();

  if (!Sentry && env.SENTRY_DSN) {
    SentryClientInit(env.SENTRY_DSN, user);
  }

  const supabase = useMemo(() => {
    if (typeof document === "undefined") return null;
    try {
      return createBrowserClient<Database>(
        env.SUPABASE_URL,
        env.SUPABASE_ANON_KEY,
        {
          // @ts-ignore
          auth: { flowType: "pkce" },
          cookieOptions,
        }
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }, [env]);

  const { revalidate } = useRevalidator();
  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      switch (event) {
        case "SIGNED_OUT":
          revalidate();
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [session?.access_token, supabase, revalidate]);

  const context = useMemo(() => ({ supabase, user }), [supabase, user]);

  return (
    <Page>
      <Outlet context={context} />
    </Page>
  );
}
