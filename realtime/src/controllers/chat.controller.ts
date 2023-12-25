import ChatUsecase from "../usecases/chat.usecase";

class ChatController {
  private chatUsecase: ChatUsecase;
  constructor(chatUsecase: ChatUsecase) {
    this.chatUsecase = chatUsecase;
  }
}

export default ChatController;
