
import RabbitMQConsumer from "./consumer";
import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { Topics } from "./topics";



async function consumeRabbitmq() {
  const userService = new RabbitMQConsumer(Exchanges.USER_EXCHANGE);

  try {
    await userService.consumeFromQueue(
      Queues.COURSE_QUEUE,
      Topics.ORDER_CREATE,
      async (msg) => {
        console.log(`Received event from ${Exchanges.USER_EXCHANGE}`);
        // processing and saving data
        console.log(msg)
      }
    );

  } catch (error) {
    console.error("Error:", error);
  }
}
export default consumeRabbitmq;
