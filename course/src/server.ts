import { app } from "./app";
import connectDb from "./config/db";
import { subscribeRabbitmq } from "./events/subscriber";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8001, () => {
  subscribeRabbitmq();
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
