import CoreLayout from "components/corelayout";

export default function Home({}) {
  return (
    <CoreLayout>
      <div className="pl-2 pt-1 pb-2 h-24 flex-none">Testing 1</div>
      <div className="object-none object-right pl-2 pt-1 flex-none h-24 ">
        Testing 2
      </div>
      <div className="pl-2 pt-1 flex-none h-24 ">Testing 3</div>
      <div className="p-2 flex-none absolute bottom-0 right-0">
        Bottom Right
      </div>
    </CoreLayout>
  );
}
