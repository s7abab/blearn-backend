import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
require("dotenv").config();

// create server
app.listen(8003, () => {
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
