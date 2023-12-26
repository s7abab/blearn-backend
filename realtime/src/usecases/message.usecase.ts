import IMessage from "../entities/message";
import MessageRepository from "../repositories/message.repository";

class MessageUsecase {
  private messageRepository: MessageRepository;
  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }

  public async createMessage(data: IMessage) {
    try {
      const message = await this.messageRepository.create(data);
      return message;
    } catch (error) {
      throw error;
    }
  }

  public async getMessagesByChatRoomId(chatRoomId: string) {
    try {
      const messages = await this.messageRepository.findByChatRoomId(
        chatRoomId
      );
      return messages;
    } catch (error) {
      throw error;
    }
  }
}

export default MessageUsecase;
