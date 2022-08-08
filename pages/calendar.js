import CoreLayout from "components/corelayout";

export default function Calendar({}) {
  return <div>Test calendar text</div>;
}

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
