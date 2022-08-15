import CoreLayout from "components/corelayout";
import { Button, Box } from "@mantine/core";
const { Client } = require("react-hydration-provider"); // Has to be a `const -- require` import or it fails to import and throws an error
import { auth } from "firebaseConfig";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

const Dashboard = () => {
  const AuthUser = useAuthUser();
  return (
    <Box>
      {AuthUser.email
        ? `Logged-in user's email: ${AuthUser.email}`
        : "Not logged in"}
    </Box>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Dashboard);
