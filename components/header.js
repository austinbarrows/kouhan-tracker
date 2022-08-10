import Link from "next/link";
import { Header, Group } from "@mantine/core";

export default function AppHeader({}) {
  return (
    <Header height={45}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Link href="/">広範 Tracker</Link>
      </Group>
    </Header>
  );
}
