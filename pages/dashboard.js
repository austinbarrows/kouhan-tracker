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
      <Box>{`Logged-in user's firebase uid: ${props.userID}`}</Box>
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
  const startDate = "2022-08-20";
  // User ID token uniquely identifies a user with their firebase uid and verifies they are legitimately logged in (or their login info has been stolen lol)
  const token = await AuthUser.getIdToken();
  console.log("before response");
  // DO NOT USE API PATH in production; instead, directly import database access logic
  const response = await fetch("http://localhost:3000/api/getCalendarData", {
    method: "POST",
    headers: {
      authorization: token,
    },
    body: JSON.stringify({
      startDate: startDate,
      numberOfDays: 7,
    }),
  });

  try {
    const data = await response.json();
    console.log(data);
    if (data.userID !== undefined) {
      return {
        props: {
          userID: data.userID,
        },
      };
    } else {
      throw new Error("No userID in response JSON");
    }
  } catch (e) {
    console.log(e);
    return {
      props: {
        userID: null,
      },
    };
  }
});

export default withAuthUser()(Dashboard);
