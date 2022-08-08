import SidebarItem from "./sidebaritem";

export default function SidebarFooter({ children }) {
  return (
    <div className="absolute bottom-0 w-full">
      <SidebarItem footer>{children}</SidebarItem>
    </div>
  );
}
