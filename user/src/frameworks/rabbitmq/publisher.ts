import amqp from "amqplib";
import RabbitMQConnection from "../config/rabbitmq";
import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { Topics } from "./topics";

class EventPublisher {
  private channel: amqp.Channel | null = null;
  private exchangeName: string;

  constructor() {
    this.exchangeName = Exchanges.USER_EXCHANGE;
  }

  private async ensureChannel(): Promise<void> {
    const connection = await RabbitMQConnection.getConnection();
    this.channel = await connection.createChannel();
    await this.channel.assertExchange(this.exchangeName, "direct", {
      durable: true,
    });
  }
  // publish user update
  public async publishUserCreate(data: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.ensureChannel();
      }

      const message = JSON.stringify(data);

      await this.publishToQueue(
        Queues.COURSE_QUEUE,
        message,
        Topics.USER_CREATE
      );
      await this.publishToQueue(
        Queues.PAYMENT_QUEUE,
        message,
        Topics.USER_CREATE
      );

      console.log(`${Topics.USER_CREATE} published`);
    } catch (error) {
      throw new Error(`Error publishing user update: ${error}`);
    }
  }
  // publish user update
  public async publishUserUpdate(data: any): Promise<void> {
    try {
      if (!this.channel) {
        await this.ensureChannel();
      }

      const message = JSON.stringify( data );

      await this.publishToQueue(
        Queues.COURSE_QUEUE,
        message,
        Topics.USER_UPDATE
      );
      await this.publishToQueue(
        Queues.PAYMENT_QUEUE,
        message,
        Topics.USER_UPDATE
      );

      console.log(`${Topics.USER_UPDATE} published`);
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

export default EventPublisher;
