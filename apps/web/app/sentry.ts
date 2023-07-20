import { useLocation, useMatches } from "@remix-run/react";
import { RewriteFrames } from "@sentry/integrations";
import * as ClientSentry from "@sentry/remix";
import { captureRemixErrorBoundaryError as clientCaptureRemixErrorBoundaryError } from "@sentry/remix";
import { useEffect } from "react";
import { Toucan } from "toucan-js";

import { VERSION } from "./config";

export let Sentry: Toucan | typeof ClientSentry | undefined;

export const SentryServerOptions = {
  requestDataOptions: {
    allowedSearchParams: true,
    allowedIps: true,
  },
  environment: process.env.NODE_ENV,
  release: VERSION,
  dist: "server",
  integrations: [
    new RewriteFrames({
      iteratee: (frame) => {
        if (!frame.filename) return frame;
        frame.filename = "index.js";
        return frame;
      },
    }),
  ],
};

export const SentryServerInit = (dsn: string, request?: Request) => {
  if (Sentry) return;
  // @ts-ignore
  Sentry = new Toucan({
    dsn,
    ...SentryServerOptions,
    request,
  });
};

export const SentryClientInit = (
  dsn: string,
  user?: { id?: string; email?: string } | null
) => {
  if (Sentry) return;
  Sentry = ClientSentry;
  // https://docs.sentry.io/platforms/javascript/guides/remix/
  ClientSentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    release: VERSION,
    dist: "browser",
    integrations: [
      new ClientSentry.BrowserTracing({
        routingInstrumentation: ClientSentry.remixRouterInstrumentation(
          useEffect,
          useLocation,
          useMatches
        ),
      }),
      // Replay is only available in the client
      new ClientSentry.Replay(),
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
  if (user?.id || user?.email) {
    ClientSentry.setUser({ id: user?.id, email: user?.email });
  }
};

export const captureRemixErrorBoundaryError = (error: any) => {
  if (Sentry === ClientSentry) {
    clientCaptureRemixErrorBoundaryError(error);
  } else {
    Sentry?.captureException?.(error);
  }
};
