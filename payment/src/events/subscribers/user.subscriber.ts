import { IUser } from "../../@types/modelTypes/course";
import connectToRabbitMQ from "../../config/rabbitmq";
import { User } from "../eventTypes/user.events";
import { USER_EXCHANGE } from "../exchanges/user.exchange";
import { createUser, updateUser } from "../handlers/user.handler";
import { USER_CREATED, USER_UPDATED } from "../queues/user.queues";

export async function subscribeRabbitmq() {
  try {
    const { channel } = await connectToRabbitMQ();

    await channel.assertExchange(USER_EXCHANGE, "direct", {
      durable: true,
    });

    await channel.assertQueue(USER_CREATED, { durable: true });
    await channel.assertQueue(USER_UPDATED, { durable: true });

    // Binding queues for different event types
    channel.bindQueue(USER_CREATED, USER_EXCHANGE, User.USER_CREATED); //eventType as a routing key
    channel.bindQueue(USER_UPDATED, USER_EXCHANGE, User.USER_UPDATED);

    // Consume messages 
    channel.consume(USER_CREATED, (msg) => {
      if (msg && msg.fields.routingKey === User.USER_CREATED) {
        const eventPayload: IUser = JSON.parse(msg.content.toString());
        createUser(eventPayload);
        console.log(`Received ${User.USER_CREATED} event`);
        channel.ack(msg);
      }
      if (msg && msg.fields.routingKey === User.USER_UPDATED) {
        const eventPayload: IUser = JSON.parse(msg.content.toString());
        updateUser(eventPayload);
        console.log(`Received ${User.USER_UPDATED} event`);
        channel.ack(msg);
      }
    });
    
  } catch (error) {
    console.error("RabbitMQ Consumer error:", error);
    throw error;
  }
}
