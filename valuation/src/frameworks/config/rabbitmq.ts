import amqp from "amqplib";
require("dotenv").config();

class RabbitMQConnection {
  private static connection: amqp.Connection | null = null;

  static async getConnection(): Promise<amqp.Connection> {
    if (!this.connection) {
      try {
        this.connection = await amqp.connect(process.env.RABBIT_MQ!);
        console.log("RabbitMQ Connected 🐰");
      } catch (error) {
        throw new Error(`Error connecting to RabbitMQ: ${error}`);
      }
    }
    return this.connection;
  }
}

export default RabbitMQConnection;
