import CoreLayout from "components/corelayout";

export default function Profile({}) {
  return <div>Test profile text</div>;
}

Profile.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
