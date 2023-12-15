import IUser from "../../entities/user";
import UserRepository from "../../repositories/user.repository";
import UserUsecase from "../../usecases/user.usecase";
import RabbitMQConsumer from "./consume";
import { Exchanges } from "./exchanges";
import { Queues } from "./queues";
import { Topics } from "./topics";

const userRepository = new UserRepository();
const userUsecase = new UserUsecase(userRepository);

async function consumeRabbitmq() {
  const userService = new RabbitMQConsumer(Exchanges.USER_EXCHANGE);
  const paymentService = new RabbitMQConsumer(Exchanges.PAYMENT_EXCHANGE);

  try {
    await userService.consumeFromQueue(
      Queues.COURSE_QUEUE,
      Topics.USER_UPDATE,
      async (msg) => {
        console.log(`Received event from ${Exchanges.USER_EXCHANGE}`);
        // processing and saving data
        await userUsecase.updateUser(msg as any);
      }
    );

    await paymentService.consumeFromQueue(
      "order_service_queue",
      "order.placed",
      (msg) => {
        console.log(msg);
        console.log(`Received event from ${Exchanges.PAYMENT_EXCHANGE}`);
      }
    );
  } catch (error) {
    console.error("Error:", error);
  }
}
export default consumeRabbitmq;
