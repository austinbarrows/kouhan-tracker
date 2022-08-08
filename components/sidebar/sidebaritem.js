export default function SidebarItem({ children, footer }) {
  let className = "border-solid border-black pl-2 py-2";
  if (footer) {
    className += " border-t";
  } else {
    className += " border-b";
  }

  return <div className={className}>{children}</div>;
}
