import { app } from "./app";
import connectDb from "./config/db";
require("dotenv").config();

// create server
app.listen(process.env.PORT, () => {
  console.log(`Server running ${process.env.PORT}`);
  connectDb();
});
