import mongoose from "mongoose";
require("dotenv").config();

const dbUrl: string = "mongodb+srv://s7abab:n4AiAOBnXsv8ygfC@cluster1.aejszzn.mongodb.net/bLearnAuth";

const connectDb = async () => {
  try {
    await mongoose.connect(dbUrl).then((data: any) => {
      console.log(`Database connected with${data.connection.host} 🥦`);
    });
  } catch (error: any) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};

export default connectDb;
