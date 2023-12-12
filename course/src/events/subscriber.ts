import connectToRabbitMQ from "../config/rabbitmq";
import courseRepository from "../repositories/course.repository";
import userRepository from "../repositories/user.repository";
import { QUEUES } from "./queues";
import { Payment, User } from "./subjects";

export async function subscribeRabbitmq() {
  const { channel } = await connectToRabbitMQ();

  // user
  await channel.assertQueue(QUEUES.USER_QUEUE, { durable: true });
  channel.consume(QUEUES.USER_QUEUE, async (msg) => {
    if (msg?.content) {
      try {
        const messageContent = msg.content.toString();
        const userData = JSON.parse(messageContent);
        if (userData.subject === User.USER_UPDATED) {
          await userRepository.updateUser(userData);
          console.log("User updated:", userData);
          channel.ack(msg);
        }
        if (userData.subject === User.USER_CREATED) {
          await userRepository.createUser(userData);
          console.log("User created:", userData);
          channel.ack(msg);
        }
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  });
// payment
  await channel.assertQueue(QUEUES.PAYMENT_QUEUE, { durable: true });
  channel.consume(QUEUES.PAYMENT_QUEUE, async (msg) => {
    if (msg?.content) {
      try {
        const messageContent = msg.content.toString();
        const paymentData = JSON.parse(messageContent);
        if (paymentData.subject === Payment.ORDER_CREATED) {
          await courseRepository.addCourseToUser(paymentData);
          console.log("Order created:", paymentData);
          channel.ack(msg);
        }
      } catch (error) {
        console.error("Error creating order:", error);
      }
    }
  });
}
