import Link from "next/link";
import { Header, Group, Container, Box, Button } from "@mantine/core";
import { DarkModeToggle } from "./darkmodetoggle";
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from "next-firebase-auth";

async function logoutUser(AuthUser) {
  // Sign out
  await AuthUser.signOut();
  // Remove auth cookie
  const res = await fetch("http://localhost:3000/api/logout");
}

const AppHeader = ({}) => {
  const AuthUser = useAuthUser();

  return (
    <Header height={55}>
      <Container fluid className="flex justify-between h-full items-center">
        {/* App name/icon div set to 11.9375 rem width because I felt like it was 1 pixel too big to align with the navbar items when set to 12rem */}
        <Link href="/">
          <Box
            className="p-2 text-2xl w-[11.9375rem] text-center cursor-pointer"
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
              borderRadius: theme.radius.md,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[5]
                    : theme.colors.gray[1],
              },
            })}
          >
            広範 Tracker
          </Box>
        </Link>
        <Box className="flex gap-4 items-center">
          {AuthUser.id === null ? (
            <Link href="/auth">
              <Button color="indigo">Login</Button>
            </Link>
          ) : (
            <Link href="/">
              <Button
                color="indigo"
                onClick={async () => {
                  await logoutUser(AuthUser);
                }}
              >
                Logout
              </Button>
            </Link>
          )}
          <DarkModeToggle></DarkModeToggle>
        </Box>
      </Container>
    </Header>
  );
};

export default withAuthUser()(AppHeader);
