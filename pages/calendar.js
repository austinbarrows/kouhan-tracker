import { Container, Grid, Skeleton } from "@mantine/core";
import CoreLayout from "components/corelayout";

export default function Calendar({}) {
  return (
    <div>
      <Grid>
        <Grid.Col span={12}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={8}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={2}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={6}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={3}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={3}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={4}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={7}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
        <Grid.Col span={3}>
          <Skeleton className="h-12 rounded-lg" animate={false}></Skeleton>
        </Grid.Col>
      </Grid>
    </div>
  );
}

Calendar.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};
