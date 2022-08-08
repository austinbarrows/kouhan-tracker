import Link from "next/link";

export default function SidebarItem({ children, footer, href }) {
  let className = `border-solid border-black pl-2 py-2 ${
    footer ? " border-t" : " border-b"
  }`;

  if (href) {
    className += " cursor-pointer";
    return (
      <Link href={href}>
        <div className={className}>{children}</div>
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}
