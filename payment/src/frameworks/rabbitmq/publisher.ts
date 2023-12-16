import { Channel, Connection } from "amqplib";
import connect from "../config/rabbitmq";

class EventPublisher {
  private channel: Channel | undefined;
  private connection: Connection | undefined;

  constructor() {
    this.channel = undefined;
    this.connection = undefined;
  }

  //to publish in a queue
  async publish(
    exchange: string,
    routingKey: string,
    data: unknown
  ): Promise<boolean> {
    await this.ensureConnection();
    if (!this.channel || !this.connection) {
      throw new Error("RabbitMQ connection not available");
    }

    try {
      await this.channel.assertExchange(exchange, "direct", { durable: true });
      await this.channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(data)),
        { persistent: true }
      );
      return true;
    } catch (err) {
      console.error("Error in publish:", err);
      return false;
    }
  }

  private async ensureConnection() {
    if (!this.channel) {
      const { channel, connection } =
        await connect();
      this.channel = channel;
      this.connection = connection;
    }
  }
}

export default EventPublisher;
