import { app } from "./app";
import connectDb from "./config/db";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8001, () => {
  connectDb()
  console.log(`Server running ${process.env.PORT}`);
});
