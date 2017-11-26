# ChatApp

A simple React application that allows two browser to exchange chat messages through a websocket connection.

The following commands are available:

* `/nick <name>` sets your name for the chat
* `/think <message>` makes the text appear in dark grey, instead of black
* `/oops` removes the last message sent
* `/fadelast` would fade out the last message to 10% visibility
* `/highlight <message>` would make the font of the message 10% bigger, and make the background 10% darker
* `/countdown <number> <url>` would start a visible countdown on the other persons browser, and at the end of the countdown redirect them to the URL specified

## Running the app

First start the server app

```
cd server
npm start
```

Then start the client app

```
cd client
npm start
```

You can now point your browser to http://localhost:3000