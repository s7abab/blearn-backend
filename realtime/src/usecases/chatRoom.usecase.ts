import IChatRoom from "../entities/chatRoom";
import ChatRepository from "../repositories/chatRoom.repository";

class ChatUsecase {
  private chatRepository: ChatRepository;
  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  public async createChatRoom(data: IChatRoom, instructorId: string) {
    try {
      const chatRoom = await this.chatRepository.createChatRoom(
        data,
        instructorId
      );
      return chatRoom;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getChatRoomsForInstructor(instructorId: string) {
    try {
      const chatRoom = await this.chatRepository.findChatRoomsByInstructorId(
        instructorId
      );
      return chatRoom;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getChatRoom(chatRoomId: string) {
    try {
      const chatRoom = await this.chatRepository.findChatRoomById(chatRoomId);
      return chatRoom;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getChatRoomByCourseId(courseId: string) {
    try {
      const chatRoom = await this.chatRepository.findChatRoomByCourseId(
        courseId
      );
      return chatRoom;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default ChatUsecase;
