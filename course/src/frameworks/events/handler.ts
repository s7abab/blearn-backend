import RabbitMQConsumer from "./consume";

async function consumeRabbitmq() {
    const userUpdatesConsumer = new RabbitMQConsumer('user_updates_exchange');
    const orderPlacedConsumer = new RabbitMQConsumer('order_updates_exchange');
  
    try {
      await userUpdatesConsumer.consumeFromQueue('course_service_queue', 'user.update', (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log(`Received user update message from queue 'course_service_queue'`);
        }
      });
  
      await orderPlacedConsumer.consumeFromQueue('order_service_queue', 'order.placed', (msg) => {
        if (msg !== null) {
          const content = msg.content.toString();
          console.log(`Received order placed message from queue 'order_service_queue'`);
        }
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  export default consumeRabbitmq;