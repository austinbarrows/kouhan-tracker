import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import CoreLayout from "components/corelayout";
import Sidebar from "components/sidebar/sidebar";
import SidebarItem from "components/sidebar/sidebaritem";
import SidebarFooter from "components/sidebar/sidebarfooter";
import Main from "components/main";

export default function Home({}) {
  return (
    <CoreLayout>
      <Sidebar>
        <SidebarItem href="/">広範 Tracker</SidebarItem>
        <SidebarItem href="/profile">User Info</SidebarItem>
        <SidebarItem href="/home">Home</SidebarItem>
        <SidebarItem href="/dashboard">Dashboard</SidebarItem>
        <SidebarItem href="/calender">Calender</SidebarItem>
        <SidebarItem href="/stats">Stats</SidebarItem>
        <SidebarItem href="/templates">Templates</SidebarItem>
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
    </CoreLayout>
  );
}
