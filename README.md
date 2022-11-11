# Kouhan Tracker
Schedule/progress tracker for a wide variety of regular actions

## Requirements
This project uses [MongoDB](https://www.mongodb.com/) to store user data, so a MongoDB installation of some kind (local, Atlas, etc.) is required for use.
Additionally, a [Firebase](https://firebase.google.com/) account is required for user authentication.

## General Setup
Run the `generateConfigFiles.js` script in the `scripts` folder, which will generate two config files required for the app to run.
```
node scripts/generateConfigFiles.js
``` 
Fill the following environment variables in the `.env.local` file according to the schema below:
- MONGODB_URI &mdash; Local mongodb URI (probably `mongodb://127.0.0.1:27017`)
- MONGODB_DB &mdash; Database name for kouhan-tracker
- GOOGLE_APPLICATION_CREDENTIALS &mdash; Path to JSON file with Firebase credentials obtained from the Firebase project for kouhan-tracker → Service accounts → Generate new private key
- COOKIE_SECRET_CURRENT &mdash; Cookie secret; can be anything but UUIDs are preferred for maximal safety
- COOKIE_SECRET_PREVIOUS &mdash; Cookie secret that MUST BE DIFFERENT from the other cookie secret; can be anything but UUIDs are preferred for maximal safety

Run `npm install` after cloning or updating.


## Development Setup
### Firebase Setup
1\. Create a Firebase account if necessary, and then create a Firebase project for kouhan-tracker.
2\. Add a Web app (</> icon) to the Firebase project. During the addition process, Firebase will display an "Add Firebase SDK" section with code. <br>
Copy the `firebaseConfig` section that looks like this:
```
const firebaseConfig = {
  apiKey: 
  authDomain: 
  projectId: 
  storageBucket: 
  messagingSenderId: 
  appId:
};
```
Paste this section into the `firebaseConfig.js` template file in the root, under/replacing the `// Add config here` comment.
<br>
<br>
3\. Add the Firebase emulator host environment variable to `.env.local`:
-  FIREBASE_AUTH_EMULATOR_HOST &mdash; Host for Firebase auth emulator (probably `127.0.0.1:9099`)

4\. Install the Firebase CLI:
```
npm install -g firebase-tools
```

5\. Run the following in the project root to configure the project to be a Firebase project (log in to Firebase if prompted):
```
firebase init
```

### Firebase Emulator Setup
6\. Initialize the Firebase emulator suite:
```
firebase init emulators
```

7\. Select only the Authentication Emulator from the list and proceed.
<br>
8\. Download the emulator now if desired.
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