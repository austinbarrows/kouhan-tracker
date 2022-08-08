import CoreLayout from "components/corelayout";

export default function Dashboard({}) {
  return <div>Test dashboard text</div>;
}

Dashboard.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
