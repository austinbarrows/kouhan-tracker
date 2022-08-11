import { Box, Container, Grid, Skeleton } from "@mantine/core";
import CoreLayout from "components/corelayout";
import dayjs from "dayjs";

export async function getServerSideProps(context) {
  let week = [];
  let j = dayjs();
  for (let i = 0; i < 7; i++) {
    week.push(j.format("dddd"));
    j = j.add(1, "day");
  }

  return {
    props: { week: week }, // will be passed to the page component as props
  };
}

export default function Calendar(props) {
  const weekdays = props.week.map((day) => {
    return (
      <Grid.Col span={1} key={day}>
        <Box className="bg-amber-300 h-full border">{day}</Box>
      </Grid.Col>
    );
  });

  return (
    <Box>
      <Grid>
        <Grid.Col span={8}>
          <Grid columns={7} gutter={0} className="h-128">
            {weekdays}
          </Grid>
        </Grid.Col>
      </Grid>
    </Box>
  );
}

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
