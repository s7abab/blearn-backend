import amqp from "amqplib";

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://rabbitmq-srv");
    const channel = await connection.createChannel();
    console.log("RabbitMq Connected 🐰");
    
    return { connection, channel };
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    throw error;
  }
};

export default connectToRabbitMQ;
