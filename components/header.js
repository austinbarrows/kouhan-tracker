import Link from "next/link";
import { Header, Group, Container } from "@mantine/core";
import { DarkModeToggle } from "./darkmodetoggle";

export default function AppHeader({}) {
  return (
    <Header height={55}>
      <Container fluid className="flex justify-between h-full items-center">
        {/* App name/icon div set to 11.9375 rem width because I felt like it was 1 pixel too big to align with the navbar items when set to 12rem */}
        <Link href="/">
          <div className="p-2 font text-2xl bg-gray-100 rounded-lg w-[11.9375rem] text-center cursor-pointer">
            広範 Tracker
          </div>
        </Link>
        <DarkModeToggle></DarkModeToggle>
      </Container>
    </Header>
  );
}
