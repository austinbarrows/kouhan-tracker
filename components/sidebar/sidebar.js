export default function Sidebar({ children }) {
  return (
    <div className="relative top-0 left-0 h-screen w-56 bg-green-300 float-left p-0 break-words flex-none">
      {children}
    </div>
  );
}
