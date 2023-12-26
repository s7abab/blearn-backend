import { Channel, Connection } from "amqplib";
import connect from "../config/rabbitmq";
import { Queues } from "./queues";

class EventConsumer {
  private channel: Channel | undefined;
  private connection: Connection | undefined;

  constructor() {
    this.channel = undefined;
    this.connection = undefined;
  }

  async listen(
    exchange: string,
    routingKey: string,
    callback: (data: any) => void
  ): Promise<void> {
    await this.ensureConnection();

    if (!this.channel || !this.connection) {
      throw new Error("RabbitMQ connection not available");
    }

    try {
      await this.channel.assertExchange(exchange, "direct", { durable: true });
      const queue = await this.channel.assertQueue(Queues.REALTIME_QUEUE);

      await this.channel.bindQueue(queue.queue, exchange, routingKey);

      // Consume messages from the queue
      this.channel.consume(queue.queue, async (data) => {
        if (data) {
          try {
            const parsedData = JSON.parse(data.content.toString());
            await callback(parsedData);
            this.channel?.ack(data); // Acknowledge successful processing
          } catch (err) {
            console.error("Error processing message:", err);
          }
        }
      });
    } catch (err) {
      console.error("Error listening to queue:", err);
    }
  }

  private async ensureConnection() {
    if (!this.channel) {
      const { channel, connection } = await connect();
      this.channel = channel;
      this.connection = connection;
    }
  }
}

export default EventConsumer;
