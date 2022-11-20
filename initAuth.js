import { init } from "next-firebase-auth";

const initAuth = () => {
  init({
    authPageURL: "/auth",
    appPageURL: "/home",
    loginAPIEndpoint: "/api/login", // required
    logoutAPIEndpoint: "/api/logout", // required
    onLoginRequestError: (err) => {
      console.error(err);
    },
    onLogoutRequestError: (err) => {
      console.error(err);
    },
    firebaseAuthEmulatorHost: "127.0.0.1:9099",
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    useFirebaseAdminDefaultCredential: true,
    firebaseClientInitConfig: {
      apiKey: "AIzaSyCXa-PEbpUiwUfjkQbDkxOTNP8dZsvfTQ4", // required
      authDomain: "kouhan-tracker.firebaseapp.com",
      databaseURL: "https://kouhan-tracker.firebaseio.com",
      projectId: "kouhan-tracker",
    },
    cookies: {
      name: "kouhan-tracker", // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: "/",
      sameSite: "strict",
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true,
    },
    onVerifyTokenError: (err) => {
      console.error(err);
    },
    onTokenRefreshError: (err) => {
      console.error(err);
    },
  });
};

export default initAuth;
