import amqp, { Channel, Connection } from "amqplib";

const connect = async function (): Promise<{ connection: Connection | undefined, channel: Channel | undefined }> {
  try {
    let channel: Channel | undefined;
    let connection: Connection | undefined;
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    console.log("Channel created");
    return { connection, channel };
  } catch (err) {
    console.error("Error connecting to RabbitMQ:", err);
    throw err;
  }
};

export  default connect;