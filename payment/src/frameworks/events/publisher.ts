import { IPublisherArgs } from "../../interfaces/eventsTypes/publisher.types";
import connectToRabbitMQ from "../config/rabbitmq";
import { QUEUES } from "./queues";

export const publishEvent = async ({ payload }: IPublisherArgs) => {
  const { channel, connection } = await connectToRabbitMQ();

  await channel.assertQueue(QUEUES.PAYMENT_QUEUE, { durable: true });
  channel.sendToQueue(
    QUEUES.PAYMENT_QUEUE,
    Buffer.from(JSON.stringify(payload)),
    { persistent: true }
  );
  console.log(`Message sent: ${payload}`);

  setTimeout(() => {
    connection.close();
    process.exit(0);
  }, 1000);
};
