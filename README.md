# Kouhan Tracker
Schedule/progress tracker for a wide variety of regular actions

## General Setup
Create a `.env.local` file in the root and add the following environment variables:
- MONGODB_URI &mdash; Local mongodb URI (probably `mongodb://localhost:27017`)
- MONGODB_DB &mdash; Database name for kouhan-tracker
- GOOGLE_APPLICATION_CREDENTIALS &mdash; Path to JSON file with Firebase credentials obtained from the the Firebase project for kouhan-tracker → Service accounts → Generate new private key
- COOKIE_SECRET_CURRENT &mdash; Cookie secret; can be anything but UUIDs are preferred for maximal safety
- COOKIE_SECRET_PREVIOUS &mdash; Cookie secret that MUST BE DIFFERENT from the other cookie secret; can be anything but UUIDs are preferred for maximal safety

Run `npm install` after cloning or updating


## Development Setup
### Firebase Setup
1\. Add the Firebase emulator host environment variable:
- FIREBASE_AUTH_EMULATOR_HOST &mdash; Host for Firebase emulator (probably `localhost:9099`)

2\. Install the Firebase CLI:
```
npm install -g firebase-tools
```

3\. Run the following in the project root to configure the project to be a Firebase project
```
firebase init
```

4\. Initialize the Firebase emulator suite
```
firebase init emulators
```
and press enter when notified that you are initializing with an existing Firebase project directory.

5\. Select only the Authentication Emulator from the list and proceed
<br>
6\. Download the emulator now if desired
<br>
<br>

### Start Development
After completing all of the general and Firebase setup steps, first run
```
firebase emulators:start
```
to start the emulator suite, or run the `firebase.sh` script from the `dev-scripts` directory.
<br>
<br>
After starting the Firebase emulator suite, run
```
npm run dev
```
whenever you are developing to run the Next.js development server, or run the `npmrundev.sh` script from the `dev-scripts` directory. This script also automatically re-runs the `npm run dev` command on CTRL + C/SIGINT/SIGTERM (and thus requires two sequential CTRL + C inputs to exit).