import UserRepository from "../../repositories/user.repository";
import EventConsumer from "./consumer";
import { Exchanges } from "./exchanges";
import { Topics } from "./topics";

const eventConsumer = new EventConsumer();
const userRepository = new UserRepository();
// Define a callback function to process the received data

const processData = async (data: any) => {
  console.log("Received data:", data);
  switch (data.topic) {
    case Topics.USER_CREATE:
      const user = await userRepository.createUser(data);
      break;
    case Topics.USER_UPDATE:
      const updatedUser = await userRepository.updateUser(data);
      break;

    default:
      break;
  }
};

// Function to start listening to the queue
export const startListening = async () => {
  try {
    await eventConsumer.listen(
      Exchanges.USER_EXCHANGE,
      Topics.USER_UPDATE,
      processData
    );
    await eventConsumer.listen(
      Exchanges.USER_EXCHANGE,
      Topics.USER_CREATE,
      processData
    );
    console.log("Listening to the queue for incoming messages...");
  } catch (error) {
    console.error("Error starting the listener:", error);
  }
};
