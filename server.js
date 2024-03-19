const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const userRoute = require("./routes/userRoute");
const session = require("express-session");
const passport = require("passport");
const connectDB = require("./config/db");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const CustomError = require("./middleware/CustomError");
const errorHandler = require("./middleware/errorHandler");
const User = require("./models/User");

require("dotenv").config();
require("./config/passport");

const sessionOptions = {
  resave: false,
  saveUninitialized: true,
  secret: "hello",
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

const app = express();
const server = createServer(app);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views");
app.use(express.static("public"));

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("User Connected");

  const { query } = socket.handshake;
  const sender_id = query.sender_id;

  socket.broadcast.emit("get-online-user", { sender_id });

  await User.findByIdAndUpdate(sender_id, {
    is_online: true,
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected");

    socket.broadcast.emit("get-offline-user", { sender_id });

    await User.findByIdAndUpdate(sender_id, {
      is_online: false,
    });
  });

  socket.on("chat message", (msg) => {
    console.log("message " + msg);
    io.emit("chat message", msg);
  });

  socket.on("newChat", (data) => {
    socket.broadcast.emit("loadNewChat", data);
  });

  socket.on("checkOnlineStatus", async (data) => {
    const receiver_id = data.receiver_id;

    const user = await User.findById(receiver_id);

    const online = user.is_online;

    socket.emit("onlineStatus", { receiver_id, online });
  });
});

app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("Welcome to advanced chat app");
});

app.all("*", (req, res, next) => {
  const err = new CustomError("Page not exists", 404);

  next(err);
});

app.use(errorHandler);

server.listen(process.env.PORT || 3000, () => {
  connectDB(process.env.DB_URI);
  console.log("server running at http://localhost:3000");
});
