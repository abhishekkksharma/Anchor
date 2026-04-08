require('dotenv').config({ path: './src/config/config.env' });
const http = require('http');
const { Server } = require('socket.io');
const app = require("./src/app");
const { connectToMongoDB } = require("./src/connectMongo");
const { setupSocket } = require("./src/socket");

const PORT = process.env.PORT || 5000;
const MONGODB_URL = process.env.MONGODB_URL;

// Create HTTP server and attach Socket.IO - changes protocols
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  },
});

// Initialize WebSocket handlers
setupSocket(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

connectToMongoDB(MONGODB_URL).then(() => {
  console.log("MongoDB connected!");
});