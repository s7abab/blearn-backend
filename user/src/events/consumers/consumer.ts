import connectToRabbitMQ from "../../config/rabbitmq";

export const consumeFromQueue = async () => {
  try {
    const { channel } = await connectToRabbitMQ();
    const queue = "user_queue";
    await channel.assertQueue(queue, { durable: true });
    console.log(`Waiting for messages in ${queue}`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const contentString = msg.content.toString();
        const message = JSON.parse(contentString);
        console.log(`Received message: ${message.productId}`);
        // Process the message as needed
        if (message.type === "ORDER-BOOKED") {
          console.log("first");
        }
        channel.ack(msg); // Acknowledge the message when it's processed
      }
    });
  } catch (error: any) {
    console.log("error in consuming message", error);
  }
};
