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

require("dotenv").config();
require("./config/passport");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "hello",
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views");
app.use(express.static("public"));

app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("Registered successfully");
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
