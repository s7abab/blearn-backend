import connectToRabbitMQ from "../../config/rabbitmq";
import { QueueTypes } from "../queues";

export const consumeFromQueue = async (queueName: QueueTypes) => {
  try {
    const { connection, channel } = await connectToRabbitMQ();
    await channel.assertQueue(queueName, { durable: true });
    console.log(`Waiting for messages in ${queueName}`);

    channel.consume(queueName, (msg: any) => {
      if (msg !== null) {
        const contentString = msg.content.toString();
        const message = JSON.parse(contentString);
        console.log(`Received message: ${message}`);
        // Process the message as needed
        if (message.type === "ORDER-BOOKED") {
          console.log("first");
        }
        channel.ack(msg); // Acknowledge the message when it's processed
      }
    });
  } catch (error: any) {
    console.error("Error consuming message:", error);
  }
};
