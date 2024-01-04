import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
import { startListening } from "./frameworks/rabbitmq/middleware";
require("dotenv").config();

startListening()
connectDb();
// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
