import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import consumeRabbitmq from "./frameworks/rabbitmq/middleware";
require("dotenv").config();

consumeRabbitmq();
// create server
app.listen(process.env.PORT || 8002, () => {
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
