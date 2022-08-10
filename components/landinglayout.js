import AppHeader from "./header";
import { AppShell } from "@mantine/core";
export default function LandingLayout({ children }) {
  return (
    <AppShell
      padding="md"
      fixed={false}
      header={<AppHeader></AppHeader>}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <div>{children}</div>
    </AppShell>
  );
}
