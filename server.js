import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

import { logger } from "./middlewares/logEvents.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { corOptions } from "./config/cors.js";

import rootRouter from "./routes/v1/root.js";

import credentials from "./middlewares/credentials.js";
import connectMongo from "./db/mongo.js";
import { socketIOOptions } from "./config/socket.js";
import nameCheckRouter from "./routes/v1/name-checker/check.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, socketIOOptions);

io.on("connection", (socket) => {
  console.log(`Client with ID of ${socket.id} connected!`);
  socket.emit("connection_event", { message: "Socket Connection Established" });
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
  socket.on("name_check_request", (payload) => {
    console.log("Name Check Event Detected", payload);
  });
});

// connecting to mongo
connectMongo();

// middlewares
app.use(credentials);
app.use(cors(corOptions));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// logger middleware
app.use(logger);

// Routes
// Test Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use("/api/v1/", rootRouter);
app.use("/api/v1/name-checker/", nameCheckRouter);

// Listening to Database
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
});

const PORT = process.env.PORT || 3500;

httpServer.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

app.use(errorHandler);
