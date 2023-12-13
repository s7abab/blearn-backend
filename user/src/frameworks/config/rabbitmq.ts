require("dotenv").config();
import amqp from "amqplib";

const connectToRabbitMQ = async () => {
  const Url = process.env.RABBITMQ_URL || ""
    try {
      const connection = await amqp.connect(Url);
      const channel = await connection.createChannel();
      console.log("RabbitMq Connected 🐰");
      return { connection, channel };
    } catch (error) {
      console.error("Error connecting to RabbitMQ:", error);
      throw error;
    }
  }

export default connectToRabbitMQ;
