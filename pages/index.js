import LandingLayout from "components/landingLayout";
import Link from "next/link";

export default function Index() {
  return (
    <Link href="/home">
      <a>Home</a>
    </Link>
  );
}

Index.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};
