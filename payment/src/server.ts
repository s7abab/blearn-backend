import { app } from "./app";
require("dotenv").config();

// create server
app.listen(process.env.PORT || 8002, () => {
  console.log(`Server running ${process.env.PORT}`);
});
