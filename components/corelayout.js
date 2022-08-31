import Head from "next/head";
import { AppShell, Box } from "@mantine/core";
import { NavbarSimple } from "./sidebar";
import AppHeader from "./header";

export default function CoreLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Kouhan Tracker</title>
        <meta
          name="description"
          content="Kouhan Tracker tracks a wide variety of things in a flexible manner to act as a versatile all-in-one tracking and calendar application. Kouhan Tracker can be used to track habits, daily tasks such as video game daily quests, skills in development, events--recurring and singular--and really almost anything else one would want to track."
        />
        {/* Potentially update/improve this description later; this is more of a quick placeholder */}
      </Head>
      <AppShell
        padding="md"
        fixed={false}
        navbar={<NavbarSimple></NavbarSimple>}
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
    </div>
  );
}
