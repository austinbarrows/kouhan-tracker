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
