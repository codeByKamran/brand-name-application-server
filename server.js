import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path";

import { logger } from "./middlewares/logEvents.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { corOptions } from "./config/cors.js";

import rootRouter from "./routes/root.js";

import credentials from "./middlewares/credentials.js";
import connectMongo from "./db/mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

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

// Listening to Database
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB.");
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

app.use(errorHandler);
