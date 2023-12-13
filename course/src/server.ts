import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import { subscribeRabbitmq } from "./frameworks/events/subscriber";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8001, () => {
  subscribeRabbitmq();
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
