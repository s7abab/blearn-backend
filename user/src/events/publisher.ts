import { IPublisherArgs } from "../@types/eventsTypes/publisher.types";
import connectToRabbitMQ from "../config/rabbitmq";
import { QUEUES } from "./queues";

export const publishEvent = async ({ payload }: IPublisherArgs) => {
  const { channel, connection } = await connectToRabbitMQ();

  await channel.assertQueue(QUEUES.USER_QUEUE, { durable: true });
  channel.sendToQueue(QUEUES.USER_QUEUE, Buffer.from(JSON.stringify(payload)), {
    persistent: true,
  });
  console.log(`Message sent: ${payload}`);

  setTimeout(() => {
    connection.close();
  }, 300);
};
