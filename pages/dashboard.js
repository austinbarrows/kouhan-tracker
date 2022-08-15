import CoreLayout from "components/corelayout";
import { Button, Box } from "@mantine/core";
const { Client } = require("react-hydration-provider"); // Has to be a `const -- require` import or it fails to import and throws an error
import { auth } from "firebaseConfig";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function createUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

async function signinTest(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userIDToken = await userCredential.user.getIdToken();
    return userIDToken;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
}

const Dashboard = () => {
  const AuthUser = useAuthUser();

  return (
    <Box>
      <Button
        color="indigo"
        variant="light"
        onClick={() => {
          createUser("test444@example.com", "18023421904820944891");
        }}
      >
        Register
      </Button>
      <Button
        color="indigo"
        variant="light"
        onClick={async () => {
          // Sign in
          const idToken = await signinTest(
            "test444@example.com",
            "18023421904820944891"
          );
          // Set auth cookie
          const res = await fetch("http://localhost:3000/api/login", {
            headers: {
              Authorization: idToken,
            },
          });
        }}
      >
        Sign In
      </Button>
      <Button
        color="indigo"
        variant="light"
        onClick={async () => {
          // Sign out
          await AuthUser.signOut();
          // Remove auth cookie
          const res = await fetch("http://localhost:3000/api/logout");
        }}
      >
        Sign Out
      </Button>
      {AuthUser.email ? AuthUser.email : "unknown"}
    </Box>
  );
};

Dashboard.getLayout = function getLayout(page) {
  return <CoreLayout>{page}</CoreLayout>;
};

export const getServerSideProps = withAuthUserTokenSSR()();

export default withAuthUser()(Dashboard);
