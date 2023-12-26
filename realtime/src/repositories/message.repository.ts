import IMessage from "../entities/message";
import chatRoomModel from "../frameworks/models/chatRoom.model";
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
      const messages = await chatRoomModel
        .findById(chatRoomId)
        .populate("messages");
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageRepository;
