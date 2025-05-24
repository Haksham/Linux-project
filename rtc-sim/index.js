const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const TICK_INTERVAL_MS = 1000;

// On HTTP GET, serve a simple status page
app.get('/', (req, res) => {
  res.send('<h1>RTC Master Clock</h1><p>WebSocket endpoint at /</p>');
});

// When a client connects, start sending ticks
io.on('connection', socket => {
  console.log('Partition connected:', socket.id);
  const ticker = setInterval(() => {
    const now = Math.floor(Date.now() / 1000); // UNIX seconds
    socket.emit('master_time', now);
  }, TICK_INTERVAL_MS);

  socket.on('disconnect', () => {
    clearInterval(ticker);
    console.log('Partition disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Master clock listening on ${PORT}`));
