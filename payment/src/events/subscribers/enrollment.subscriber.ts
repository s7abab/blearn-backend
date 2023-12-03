import { IEnrollment } from "../../@types/modelTypes/order";
import connectToRabbitMQ from "../../config/rabbitmq";
import { Enrollment } from "../subjects/order.event";
import { ENROLLMENT_EXCHANGE } from "../exchanges/payment.exchange";
import { createEnrollment } from "../handlers/enrollment.handler";
import { ENROLLMENT_CREATED } from "../queues/order.queues";

export async function subscribeRabbitmq() {
  try {
    const { channel } = await connectToRabbitMQ();

    await channel.assertExchange(ENROLLMENT_EXCHANGE, "direct", {
      durable: true,
    });

    await channel.assertQueue(ENROLLMENT_CREATED, { durable: true });

    // Binding queues for different event types
    channel.bindQueue(
      ENROLLMENT_CREATED,
      ENROLLMENT_EXCHANGE,
      Enrollment.ENROLLMENT_CREATED
    ); //eventType as a routing key

    // Consume messages
    channel.consume(ENROLLMENT_CREATED, (msg) => {
      if (msg && msg.fields.routingKey === Enrollment.ENROLLMENT_CREATED) {
        const eventPayload: IEnrollment = JSON.parse(msg.content.toString());
        console.log(`Received ${Enrollment.ENROLLMENT_CREATED} event`);
        createEnrollment(eventPayload);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("RabbitMQ Consumer error:", error);
    throw error;
  }
}
