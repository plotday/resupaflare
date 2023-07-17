import { Container, Title } from "@mantine/core";
import type { V2_MetaFunction } from "@remix-run/cloudflare";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <Container>
      <Title>Welcome to Resupaflare</Title>
      <ul>
        <li>
          <a target="_blank" href="https://remix.run/" rel="noreferrer">
            Remix
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://v7.mantine.dev/getting-started"
            rel="noreferrer"
          >
            Mantine v7
          </a>
        </li>
        <li>
          <a target="_blank" href="https://supabase.com/" rel="noreferrer">
            Supabase
          </a>
        </li>
      </ul>
    </Container>
  );
}
