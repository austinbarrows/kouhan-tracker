# Bug List
## ID: 1
### Tags: [possible][unsolved]
<br>
There is possibly a bug where having a server go down and then come back up followed by a client submitting a request to the API will yield a firebase error like the following:

```
FirebaseAppError: The default Firebase app does not exist. Make sure you call initializeApp() before using any of the Firebase services.

<omitted for brevity>

errorInfo: {
    code: 'app/no-app',
    message: 'The default Firebase app does not exist. Make sure you call initializeApp() before using any of the Firebase services.'
},
codePrefix: 'app'
```

However, this never arises when the client logs in and then the server does NOT
go down between the time the user logs in and when they send the request, so I
think it is an extremely rare situation in reality, so I won't look into a fix
for it right now.

## ID: 2
### Tags: [unsolved]
There is a bug where if a user tries to submit an API request and they have waited long enough,
their Firebase ID token will have expired, and thus the API request cannot be completed because
the token cannot be verified. This leads to the following error message:

```
FirebaseAuthError: Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retriev
e an ID token.

<omitted for brevity>

errorInfo: {
    code: 'auth/id-token-expired',
    message: 'Firebase ID token has expired. Get a fresh ID token from your client app and try again (auth/id-token-expired). See https://firebase.google.com/docs/auth/admin/verify-id-tokens for details on how to retrieve an ID token.'
},
codePrefix: 'auth'
```