import amqp, { ConsumeMessage } from "amqplib";
import RabbitMQConnection from "../config/rabbitmq";

class RabbitMQConsumer {
  private channel: amqp.Channel | null = null;
  private exchangeName: string;

  constructor(private exchange: string) {
    this.exchangeName = exchange;
  }

  private async ensureChannel(): Promise<void> {
    const connection = await RabbitMQConnection.getConnection();
    this.channel = await connection.createChannel();
    await this.channel!.assertExchange(this.exchangeName, "direct", {
      durable: true,
    });
  }

  public async consumeFromQueue(
    queueName: string,
    routingKey: string,
    callback: (msg: ConsumeMessage | null) => void
  ): Promise<void> {
    try {
      if (!this.channel) {
        await this.ensureChannel();
      }

      await this.channel!.assertQueue(queueName, { durable: true });
      await this.channel!.bindQueue(queueName, this.exchangeName, routingKey);

      console.log(`Waiting for messages in queue '${queueName}'...`);

      this.channel!.consume(
        queueName,
        (msg) => {
          if (msg !== null) {
            callback(JSON.parse(msg.content.toString()));
            this.channel?.ack(msg);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      console.log(`Error consuming messages from queue: ${error}`);
    }
  }
  // cthis function for closing the connection
  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
        console.log("RabbitMQ Channel Closed");
      }
    } catch (error) {
      console.log(`Error closing RabbitMQ channel: ${error}`);
    }
  }
}

export default RabbitMQConsumer;
