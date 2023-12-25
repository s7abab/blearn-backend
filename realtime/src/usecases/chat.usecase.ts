import ChatRepository from "../repositories/chat.repository";

class ChatUsecase {
  private chatRepository: ChatRepository;
  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }
}

export default ChatUsecase;
