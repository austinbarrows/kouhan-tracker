import Head from "next/head";
import Image from "next/image";
import Sidebar from "../components/sidebar/sidebar";
import SidebarItem from "../components/sidebar/sidebaritem";
import SidebarHeader from "../components/sidebar/sidebarheader";

export default function Home() {
  return (
    <div className="text-4xl">
      <Head>
        <title>Kouhan Tracker</title>
        <meta
          name="description"
          content="Kouhan Tracker tracks a wide variety of things in a flexible manner to act as a versatile all-in-one tracking and calender application. Kouhan Tracker can be used to track habits, daily tasks such as video game daily quests, skills in development, events--recurring and singular--and really almost anything else one would want to track."
        />{" "}
        {/* Potentially update/improve this description later; this is more of a quick placeholder */}
      </Head>
      <Sidebar>
        <SidebarHeader>広範 Tracker</SidebarHeader>
        <SidebarItem itemText="User Info"></SidebarItem>
        <SidebarItem itemText="Home"></SidebarItem>
        <SidebarItem itemText="Dashboard"></SidebarItem>
        <SidebarItem itemText="Calender"></SidebarItem>
        <SidebarItem itemText="Stats"></SidebarItem>
        <SidebarItem itemText="Templates"></SidebarItem>
      </Sidebar>
      <div className="bg-amber-300 h-screen max-h-full overflow-clip break-words object-fill">
        Test text
      </div>
    </div>
  );
}
