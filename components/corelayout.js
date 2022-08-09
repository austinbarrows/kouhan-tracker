import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import {
  AppShell,
  Navbar,
  Header,
  Group,
  ActionIcon,
  useMantineColorScheme,
} from "@mantine/core";
import { NavbarSimple } from "./sidebar";

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
        header={
          <Header height={45}>
            <Group sx={{ height: "100%" }} px={20} position="apart"></Group>
          </Header>
        }
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
    </div>
  );
}
