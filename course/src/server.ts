require("dotenv").config();
import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import { redis } from "./frameworks/config/redis";
import { startListening } from "./frameworks/rabbitmq/middleware";

// mongoDB connection
connectDb();
// rabbitmq consumer connection
startListening();

// redis connection
redis;

// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running ${process.env.PORT}`);
});
  