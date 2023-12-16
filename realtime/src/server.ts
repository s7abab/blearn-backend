import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8003, () => {
  connectDb();
  console.log(`Server running ${process.env.PORT}`);
});
