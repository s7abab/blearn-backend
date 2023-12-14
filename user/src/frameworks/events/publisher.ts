import amqp from "amqplib";
import RabbitMQConnection from "../config/rabbitmq";

class RabbitMQService {
  private channel: amqp.Channel | null = null;
  private exchangeName: string;

  constructor(private exchange: string) {
    this.exchangeName = exchange;
  }

  private async ensureChannel(): Promise<void> {
    const connection = await RabbitMQConnection.getConnection();
    this.channel = await connection.createChannel();
    await this.channel.assertExchange(this.exchangeName, "direct", {
      durable: true,
    });
  }

  public async publishUserUpdate(updatedData: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.ensureChannel();
      }

      const message = JSON.stringify({ updatedData });

      await this.publishToQueue("course_service_queue", message, "user.update");
      await this.publishToQueue("payment_service_queue", message, "user.update");

      console.log(`User update published to services for user`);
    } catch (error) {
      throw new Error(`Error publishing user update: ${error}`);
    }
  }

  private async publishToQueue(
    queueName: string,
    message: string,
    routingKey: string
  ): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error("Channel not initialized");
      }

      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, this.exchangeName, routingKey);
      await this.channel.sendToQueue(queueName, Buffer.from(message), {
        persistent: true,
      });
      console.log(
        `Message sent to queue '${queueName}' with routing key '${routingKey}'`
      );
    } catch (error) {
      throw new Error(`Error publishing message to queue: ${error}`);
    }
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.channel = null;
        console.log("RabbitMQ Channel Closed");
      }
    } catch (error) {
      throw new Error(`Error closing RabbitMQ channel: ${error}`);
    }
  }
}

export default RabbitMQService;
