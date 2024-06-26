import path from "path";
import "dotenv/config";
import { fileURLToPath } from "url";
import express from "express";


// Load environment variables from the .env file located in the parent directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


import "./utils/db.js";
import http from 'http';
import { Server } from "socket.io";
import cors from 'cors';
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";
import testRoute from "./routes/test.route.js";




const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: true
}));

app.use(cookieParser());
app.use(express.json());

const PORT = process.env.PORT || 3000;

console.log(path.join(__dirname, '../client/dist'));
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/api', (req, res) => {
  res.send(`<h1>hey I am here working fine!</h1>`)
})
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/test", testRoute);


//// socket implementation
let onlineUsers = [];

const addUser = (userId, socketId) => {
  if (!onlineUsers.some((user) => user.userId === userId)) {
    onlineUsers.push({ userId, socketId });
  }
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

const removeUser = async (socketId) => {
  const user = onlineUsers.find((user) => user.socketId === socketId);
  if (user) {
    try {
      await fetch(`http://localhost:8080/api/user/update-lastseen/${user.userId}`, {
        method: 'POST',
      });
    } catch (error) {
      console.error(error);
    } finally {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
    }
  }
};

io.on("connection", (socket) => {

  socket.on('newUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('updateUserList', onlineUsers);
  });

  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver) {
      io.to(receiver.socketId).emit('getMessage', data);
    }
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    io.emit('updateUserList', onlineUsers);
  });

  socket.on('getUserStatus', (receiverId) => {
    const receiver = getUser(receiverId);
    io.to(socket.id).emit('userStatus', { online: !!receiver });
  });

});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'dist', 'index.html'))
})


app.use((err, req, res, next) => {
  const statuscode = err.statuscode || 500;
  const message = err.message || "internal server error";
  return res.status(statuscode).json({
    success: false,
    statuscode,
    message,
  });
});


server.listen(PORT, () => console.log(`Server running on port : ${PORT}`));

export default app;



// app.use(cors({
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) === -1) {
//       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
//       return callback(new Error(msg), false);
//     }
//     return callback(null, true);
//   }
// }));

// var allowedOrigins = ["http://localhost:5173", "http://172.20.10.8:5173", "http://192.168.1.10:5173"];
// var allowedOrigins = JSON.parse(process.env.ALLOWED_ORIGINS);