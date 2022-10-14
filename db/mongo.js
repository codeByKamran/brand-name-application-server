import mongoose from "mongoose";
import config from "../config/env.js";

const connectMongo = async () => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.log(err);
  }
};

export default connectMongo;
