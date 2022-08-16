import CoreLayout from "components/corelayout";
import { Button, Box } from "@mantine/core";
const { Client } = require("react-hydration-provider"); // Has to be a `const -- require` import or it fails to import and throws an error
import { auth } from "firebaseConfig";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from "next-firebase-auth";

const Dashboard = (props) => {
  const AuthUser = useAuthUser();
  return (
    <Box>
      <Box>
        {AuthUser.email
          ? `Logged-in user's name: ${AuthUser.displayName}`
          : "Not logged in"}
      </Box>
      <Box>{props.uid}</Box>
    </Box>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async ({ AuthUser }) => {
  // Optionally, get other props.
  const token = await AuthUser.getIdToken();
  const response = await fetch("http://localhost:3000/api/getCalendarData", {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });
  const data = await response.json();
  return {
    props: {
      uid: data.uid,
    },
  };
});

export default withAuthUser()(Dashboard);
