import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "components/sidebar/sidebar";
import SidebarItem from "components/sidebar/sidebaritem";
import SidebarFooter from "components/sidebar/sidebarfooter";
import Main from "components/main";
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
      <div className="text-4xl h-screen w-full flex">
        <Sidebar>
          <SidebarItem href="/">広範 Tracker</SidebarItem>
          <SidebarItem href="/profile">User Info</SidebarItem>
          <SidebarItem href="/home">Home</SidebarItem>
          <SidebarItem href="/dashboard">Dashboard</SidebarItem>
          <SidebarItem href="/calendar">Calendar</SidebarItem>
          <SidebarItem href="/stats">Stats</SidebarItem>
          <SidebarItem href="/templates">Templates</SidebarItem>
          <SidebarFooter>Footer test</SidebarFooter>
        </Sidebar>
        <Main>{children}</Main>
      </div>
    </div>
  );
}
