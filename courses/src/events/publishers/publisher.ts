import connectToRabbitMQ from "../../config/rabbitmq";

export async function sendMessage(message: any, queueName: string) {
  try {
    const { channel } = await connectToRabbitMQ();
    // Send messages to the queue
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Sent message: "${message}" to queue: ${queueName}`);
    
    channel.close();
  } catch (error) {
    console.error("Error sending message to RabbitMQ:", error);
  }
}
