import { app } from "./app";
import connectDb from "./config/db";
import { startRabbitMQConsumer } from "./events/consumers/user.consumer";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8001, () => {
  startRabbitMQConsumer();
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
