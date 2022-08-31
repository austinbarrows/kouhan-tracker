import { useState } from "react";
import { createStyles, Navbar, Group, Code } from "@mantine/core";
import {
  IconHome,
  IconLayoutDashboard,
  IconUserCircle,
  IconCalendar,
  IconChartBar,
  IconWallpaper,
} from "@tabler/icons";
import Link from "next/link";
import { Router, useRouter } from "next/router";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "/profile", label: "Profile", icon: IconUserCircle },
  { link: "/home", label: "Home", icon: IconHome },
  { link: "/dashboard", label: "Dashboard", icon: IconLayoutDashboard },
  { link: "/calendar", label: "Calendar", icon: IconCalendar },
  { link: "/stats", label: "Stats", icon: IconChartBar },
  { link: "/templates", label: "Templates", icon: IconWallpaper },
];

export function NavbarSimple() {
  const { classes, cx } = useStyles();
  const router = useRouter();
  const [active, setActive] = useState(router.pathname);

  const links = data.map((item) => (
    <Link href={item.link} key={item.link}>
      <a
        className={cx(classes.link, {
          [classes.linkActive]: item.link === active,
        })}
        href={item.link}
        onClick={(event) => {
          setActive(item.link);
        }}
      >
        <item.icon className={classes.linkIcon} stroke={1.5} />
        <span>{item.label}</span>
      </a>
    </Link>
  ));

  return (
    <Navbar className="w-56" p="md">
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <span>Placeholder</span>
        </a>
      </Navbar.Section>
    </Navbar>
  );
}
