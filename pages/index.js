import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "components/sidebar/sidebar";
import SidebarItem from "components/sidebar/sidebaritem";
import SidebarHeader from "components/sidebar/sidebarheader";
import SidebarFooter from "components/sidebar/sidebarfooter";
import Main from "components/main";

export default function Home() {
  return (
    <div className="text-4xl h-screen w-full flex">
      <Head>
        <title>Kouhan Tracker</title>
        <meta
          name="description"
          content="Kouhan Tracker tracks a wide variety of things in a flexible manner to act as a versatile all-in-one tracking and calender application. Kouhan Tracker can be used to track habits, daily tasks such as video game daily quests, skills in development, events--recurring and singular--and really almost anything else one would want to track."
        />
        {/* Potentially update/improve this description later; this is more of a quick placeholder */}
      </Head>
      <Sidebar>
        <SidebarHeader>広範 Tracker</SidebarHeader>
        <SidebarItem>User Info</SidebarItem>
        <SidebarItem>Home</SidebarItem>
        <SidebarItem>Dashboard</SidebarItem>
        <SidebarItem>Calender</SidebarItem>
        <SidebarItem>Stats</SidebarItem>
        <SidebarItem>Templates</SidebarItem>
        <SidebarFooter>Footer test</SidebarFooter>
      </Sidebar>
      <Main>
        <div className="pl-2 pt-1 pb-2 h-24 flex-none">Testing 1</div>
        <div className="object-none object-right pl-2 pt-1 flex-none h-24 ">
          Testing 2
        </div>
        <div className="pl-2 pt-1 flex-none h-24 ">Testing 3</div>
        <div className="p-2 flex-none absolute bottom-0 right-0">
          Bottom Right
        </div>
      </Main>
    </div>
  );
}
