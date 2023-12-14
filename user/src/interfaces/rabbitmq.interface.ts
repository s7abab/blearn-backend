interface RabbitMQServiceInterface {
  publishToQueue(queueName: string, message: string): Promise<void>;
}
