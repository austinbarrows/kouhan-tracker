import CoreLayout from "components/coreLayout";
import { Button, Box } from "@mantine/core";
const { Client } = require("react-hydration-provider"); // Has to be a `const -- require` import or it fails to import and throws an error
import { auth } from "firebaseConfig";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";
import dayjs from "dayjs";

const Dashboard = (props) => {
  const AuthUser = useAuthUser();
  return (
    <Box>
      <Box>
        {AuthUser.email
          ? `Logged-in user's name: ${AuthUser.displayName}`
          : "Not logged in"}
      </Box>
    </Box>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})();

export default withAuthUser()(Dashboard);
