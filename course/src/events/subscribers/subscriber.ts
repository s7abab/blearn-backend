import { IUser } from "../../@types/modelTypes/course";
import connectToRabbitMQ from "../../config/rabbitmq";
import { Order } from "../eventTypes/order.event";
import { User } from "../eventTypes/user.events";
import { PAYMENT_EXCHANGE } from "../exchanges/payment.exchange";
import { USER_EXCHANGE } from "../exchanges/user.exchange";
import { createEnrollment } from "../handlers/order.handler";
import { createUser, updateUser } from "../handlers/user.handler";
import { ORDER_CREATED } from "../queues/order.queues";
import { USER_CREATED, USER_UPDATED } from "../queues/user.queues";

export async function subscribeRabbitmq() {
  try {
    const { channel } = await connectToRabbitMQ();

    // user exchange
    await channel.assertExchange(USER_EXCHANGE, "direct", {
      durable: true,
    });

    // payment exchange
    await channel.assertExchange(PAYMENT_EXCHANGE, "direct", {
      durable: true,
    });

    // user queues
    await channel.assertQueue(USER_CREATED, { durable: true });
    await channel.assertQueue(USER_UPDATED, { durable: true });

    // payment queues
    await channel.assertQueue(ORDER_CREATED, { durable: true });

    // Binding queues for different event types

    // user
    channel.bindQueue(USER_CREATED, USER_EXCHANGE, User.USER_CREATED); //eventType as a routing key
    channel.bindQueue(USER_UPDATED, USER_EXCHANGE, User.USER_UPDATED);

    // payment
    channel.bindQueue(ORDER_CREATED, PAYMENT_EXCHANGE, Order.ORDER_CREATED);

    // Consume messages

    // user
    channel.consume(USER_CREATED, (msg) => {
      if (msg && msg.fields.routingKey === User.USER_CREATED) {
        const eventPayload: IUser = JSON.parse(msg.content.toString());
        console.log(`Received ${User.USER_CREATED} event`);
        createUser(eventPayload)
          .then(() => {
            channel.ack(msg);
          })
          .catch((error: any) => {
            console.log("Error in creating user", error);
          });
      }
      if (msg && msg.fields.routingKey === User.USER_UPDATED) {
        const eventPayload: IUser = JSON.parse(msg.content.toString());
        console.log(`Received ${User.USER_UPDATED} event`);
        updateUser(eventPayload)
          .then(() => {
            channel.ack(msg);
          })
          .catch((error: any) => {
            console.log("Error in updating user", error);
          });
      }
    });

    // payment
    channel.consume(ORDER_CREATED, (msg) => {
      if (msg && msg.fields.routingKey === Order.ORDER_CREATED) {
        const eventPayload = JSON.parse(msg.content.toString());
        console.log(`Received ${Order.ORDER_CREATED} event`);
        createEnrollment(eventPayload)
          .then(() => {
            channel.ack(msg);
          })
          .catch((error: any) => {
            console.log("Error in create enrollment", error);
          });
      }
    });
  } catch (error) {
    console.error("RabbitMQ Consumer error:", error);
    throw error;
  }
}
