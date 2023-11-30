import connectToRabbitMQ from "../../config/rabbitmq";
import { User } from "../eventTypes/user.events";
import { USER_EXCHANGE } from "../exchanges/user.exchange";
import { USER_QUEUE } from "../queues/user.queues";


export async function startRabbitMQConsumer() {
  try {
    const { channel } = await connectToRabbitMQ();

    await channel.assertExchange(USER_EXCHANGE, "direct", {
      durable: true,
    });

    await channel.assertQueue(USER_QUEUE, { durable: true });
    channel.bindQueue(USER_QUEUE, USER_EXCHANGE, User.USER_CREATED);

    channel.consume(USER_QUEUE, (msg) => {
      if (msg) {
        const eventPayload = JSON.parse(msg.content.toString());
        console.log(`Received ${channel} event:`, eventPayload);
        // Handle USER_CREATED event within the Express application
        // Example: Emit an event or trigger some action
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("RabbitMQ Consumer error:", error);
    throw error;
  }
}
