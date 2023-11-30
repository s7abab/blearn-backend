import connectToRabbitMQ from "../../config/rabbitmq";
import { User } from "../eventTypes/user.events";
import { USER_EXCHANGE } from "../exchanges/user.exchange";

export async function publishUserCreatedEvent(userId: string) {
  try {
    const { channel } = await connectToRabbitMQ();
    await channel.assertExchange(USER_EXCHANGE, "direct", {
      durable: true,
    });

    const eventPayload = {
      eventType: User.USER_CREATED,
      userId: "123456",
    };

    channel.publish(
      USER_EXCHANGE,
      User.USER_CREATED,
      Buffer.from(JSON.stringify(eventPayload)),
      {
        persistent: true,
      }
    );

    console.log(`Published USER_CREATED event for user ${userId}`);

    await channel.close();
  } catch (error) {
    console.error("Error publishing USER_CREATED event:", error);
    throw error;
  }
}
