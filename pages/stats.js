import CoreLayout from "components/corelayout";

export default function Stats({}) {
  return <div>Test stats text</div>;
}

Stats.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
