import { Container } from "@mantine/core";
import CoreLayout from "components/corelayout";

export default function Calendar({}) {
  return <Container className="px-0">Test calendar text new</Container>;
}

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
