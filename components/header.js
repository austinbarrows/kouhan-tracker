import Link from "next/link";
import { Header, Group } from "@mantine/core";
import { DarkModeToggle } from "./darkmodetoggle";

export default function AppHeader({}) {
  return (
    <Header height={55}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Link href="/">広範 Tracker</Link>
        <DarkModeToggle></DarkModeToggle>
      </Group>
    </Header>
  );
}