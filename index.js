const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
app.use(express.static('build'));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('Broadcast: %s', message);
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  ws.on("close", function clientDisconnected() {
    console.log('Client disconnected');
    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          command: "quit"
        }));
      }
    });
  });
});


server.listen(process.env.PORT, function listening() {
  console.log('Listening on %d', server.address().port);
});
