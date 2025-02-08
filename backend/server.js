const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const app = express();
const {ChatBot} = require("./ChatBot");
require("dotenv").config();
const PORT = process.env.PORT;
app.use(cors({
  origin: "http://localhost:3000", // Frontend origin
  credentials: true, // Allow cookies
}));
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/chat",ChatBot);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});