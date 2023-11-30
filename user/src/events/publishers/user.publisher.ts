import { IPublisherArgs } from "../../@types/eventsTypes/publisher.types";
import connectToRabbitMQ from "../../config/rabbitmq";
import { USER_EXCHANGE } from "../exchanges/user.exchange";

export async function publishEvent({ exchage, type, payload }: IPublisherArgs) {
  try {
    const { channel,connection } = await connectToRabbitMQ();
    await channel.assertExchange(USER_EXCHANGE, "direct", {
      durable: true,
    });
console.log(exchage)
    channel.publish(
      exchage, // exchange
      type, // eventType
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      }
    );

    console.log(`Published ${type} event : ${payload}`);

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error(`Error publishing ${type} event:`, error);
    throw error;
  }
}
