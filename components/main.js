export default function Main({ children }) {
  return (
    <main className="flex flex-wrap overflow-clip bg-amber-300 w-full h-screen max-h-full break-words">
      {children}
    </main>
  );
}
