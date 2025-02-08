const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const authRouter = require("./router/Authrouter.js");
const { sessionMiddleware, wrap, corsConfig} = require("./controllers/ServerController.js");
const {authorizeUser}= require("./controllers/SocketController.js")
const helmet = require("helmet");

const app = express();
const {ChatBot} = require("./ChatBot");
require("dotenv").config();
const PORT = process.env.PORT;
const server = require("http").createServer(app);

const io = new Server(server, {
    cors: corsConfig
});

// Middleware to parse JSON request bodies
app.use(cors(corsConfig));
app.use(sessionMiddleware)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});


app.post("/chat",ChatBot);
app.use("/auth", authRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
io.on("connect", (socket) => {
  initializeUser(socket);
  console.log("User connected");
});
server.listen(4000, () => {
  console.log("Server listening on port 4000");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});