import RabbitMQConsumer from "./consume";
import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { Topics } from "./topics";

async function consumeRabbitmq() {
  const userService = new RabbitMQConsumer(Exchanges.USER_EXCHANGE);
  const paymentService = new RabbitMQConsumer(Exchanges.PAYMENT_EXCHANGE);

  try {
  } catch (error) {
    console.error("Error:", error);
  }
}
export default consumeRabbitmq;
