import { withAuthUser, AuthAction } from "next-firebase-auth";
import LandingLayout from "components/landinglayout";
import { useToggle, upperFirst } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  Box,
} from "@mantine/core";
import { auth } from "firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

async function createUser(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    await fetch("http://localhost:3000/api/login", {
      headers: {
        Authorization: idToken,
      },
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

async function loginUser(email, password) {
  console.log("in login user");

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("signup working");
    const idToken = await userCredential.user.getIdToken();
    await fetch("http://localhost:3000/api/login", {
      headers: {
        Authorization: idToken,
      },
    });
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  }
}

const Auth = (props) => {
  const [type, toggle] = useToggle(["Login", "Register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: (val) =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  return (
    <Box className="flex justify-center">
      <Paper radius="md" p="xl" className="w-100" withBorder {...props}>
        <Text size="lg" weight={500}>
          {type}
        </Text>

        <form
          onSubmit={form.onSubmit(async (values) => {
            let email = values.email;
            let password = values.password;

            console.log("form submitted");

            if (type === "Login") {
              await loginUser(email, password);
            } else {
              await createUser(email, password);
            }
          })}
        >
          <Stack>
            {type === "Register" && (
              <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) =>
                  form.setFieldValue("name", event.currentTarget.value)
                }
              />
            )}

            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              value={form.values.email}
              onChange={(event) =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
            />
          </Stack>

          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "Register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
            >
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Box>
  );
};

Auth.getLayout = function getLayout(page) {
  return <LandingLayout>{page}</LandingLayout>;
};

export default withAuthUser({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth);
