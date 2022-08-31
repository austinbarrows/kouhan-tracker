import AppHeader from "./header";
import { AppShell, Box } from "@mantine/core";
export default function LandingLayout({ children }) {
  return (
    <AppShell
      padding="md"
      fixed={true}
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
      <Box>{children}</Box>
    </AppShell>
  );
}
