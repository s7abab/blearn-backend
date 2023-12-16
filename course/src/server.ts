require("dotenv").config();
import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import { startListening } from "./frameworks/rabbitmq/middleware";

startListening();
// create server
app.listen(process.env.PORT || 8001, () => {
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
