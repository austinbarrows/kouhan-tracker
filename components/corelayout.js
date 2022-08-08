import Head from "next/head";

export default function CoreLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Kouhan Tracker</title>
        <meta
          name="description"
          content="Kouhan Tracker tracks a wide variety of things in a flexible manner to act as a versatile all-in-one tracking and calender application. Kouhan Tracker can be used to track habits, daily tasks such as video game daily quests, skills in development, events--recurring and singular--and really almost anything else one would want to track."
        />
        {/* Potentially update/improve this description later; this is more of a quick placeholder */}
      </Head>
      <div className="text-4xl h-screen w-full flex">{children}</div>
    </div>
  );
}
