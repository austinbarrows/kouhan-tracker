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
  updateProfile,
} from "firebase/auth";
import create from "zustand";

async function createUser(name, email, password, setError) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await updateProfile(auth.currentUser, {
      displayName: name,
    });

    const idToken = await userCredential.user.getIdToken();
    // Register if necessary; this API call will do nothing if the user is already registered
    const registerRes = await fetch("/api/register", {
      method: "POST",
      headers: {
        authorization: idToken,
      },
    });

    await fetch("/api/login", {
      headers: {
        Authorization: idToken,
      },
    });
  } catch (error) {
    // Super basic error handling for now; might be sufficient a long time though, not sure
    // Might not run when necessary(?) due to cookies and login mechanics
    setError(true);
    console.log(error);
  }
}

async function loginUser(email, password, setError) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const idToken = await userCredential.user.getIdToken();
    await fetch("/api/login", {
      headers: {
        Authorization: idToken,
      },
    });
  } catch (error) {
    // Super basic error handling for now; might be sufficient a long time though, not sure
    setError(true);
    console.log(error);
  }
}

async function formOnSubmit(values) {
  let email = values.email;
  let password = values.password;
  let name = values.name;
  console.log("form submitted");

  if (type === "Login") {
    await loginUser(email, password, setError);
  } else {
    await createUser(name, email, password, setError);
  }
}

const useErrorStore = create((set) => ({
  error: false,
  setError: (updatedError) => {
    set((state) => ({
      error: updatedError,
    }));
  },
}));

const Auth = (props) => {
  // State
  const errorState = useErrorStore((state) => state.error);
  const setError = useErrorStore((state) => state.setError);
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
        val.length <= 12
          ? "Password should include at least 12 characters"
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
            await formOnSubmit(values);
          })}
        >
          <Stack>
            {/* This feels kinda hacky, so I may improve this later so it's not so awkward, but it's only 2 lines so it's okay for now */}
            {errorState && type === "Register" && (
              <Box className="text-red-500">
                Email already in use, please use a different email or log in
              </Box>
            )}
            {errorState && type === "Login" && (
              <Box className="text-red-500">
                Email or password invalid, please try again
              </Box>
            )}

            {type === "Register" && (
              <TextInput
                required
                label="Display Name (can change later)"
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
              onChange={(event) => {
                form.setFieldValue("email", event.currentTarget.value);
                // Clear error message since user is trying to correct it
                setError(false);
              }}
              error={form.errors.email && "Invalid email"}
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
              value={form.values.password}
              onChange={(event) => {
                form.setFieldValue("password", event.currentTarget.value);
                // Clear error message since user is trying to correct it
                setError(false);
              }}
              error={
                form.errors.password &&
                "Password should include at least 12 characters"
              }
            />
          </Stack>
          <Group position="apart" mt="xl">
            <Anchor
              component="button"
              type="button"
              color="dimmed"
              onClick={() => {
                toggle();
                // Clear error since it will no longer be accurate for the different form type
                setError(false);
              }}
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
