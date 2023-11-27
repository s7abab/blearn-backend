import { app } from "./app";
import connectDb from "./config/db";
import { startConsumer } from "./events/consumers/consumer";
import { QueueTypes } from "./events/queues";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8001, () => {
  connectDb()
  startConsumer(QueueTypes.user_queue);
  console.log(`Server running ${process.env.PORT}`);
});
