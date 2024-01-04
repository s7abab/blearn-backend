import { app } from "./frameworks/config/app";
import connectDb from "./frameworks/config/db";
require("dotenv").config();

connectDb();
// create server
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running ${process.env.PORT}`);
});
