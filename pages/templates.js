import CoreLayout from "components/corelayout";

export default function Templates({}) {
  return <div>Test templates text</div>;
}

Templates.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
