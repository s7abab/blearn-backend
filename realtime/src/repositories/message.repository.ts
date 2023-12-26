import IMessage from "../entities/message";
import messageModel from "../frameworks/models/message.model";

class MessageRepository {
  constructor() {}

  public async create(data: IMessage) {
    try {
      const message = await messageModel.create(data);
      return message;
    } catch (error) {
      throw error;
    }
  }

  public async findByChatRoomId(chatRoomId: string) {
    try {
      const messages = await messageModel.find({ chatRoomId }).exec();
      return messages;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default MessageRepository;
