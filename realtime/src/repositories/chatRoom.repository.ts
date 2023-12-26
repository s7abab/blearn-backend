import IChatRoom from "../entities/chatRoom";
import chatRoomModel from "../frameworks/models/chatRoom.model";

class ChatRepository {
  constructor() {}

  public async createChatRoom(data: IChatRoom, instructorId: string) {
    try {
      const existingChatRoom = await chatRoomModel.findOne({
        courseId: data.courseId,
      });

      if (existingChatRoom) {
        throw new Error("Chat room already exists for this course");
      }

      const chatRoomData = {
        ...data,
        members: [
          {
            userId: instructorId,
            isAdmin: true,
            isCreator: true,
          },
        ],
      };
      const chatRoom = await chatRoomModel.create(chatRoomData);

      return chatRoom;
    } catch (error) {
      throw error;
    }
  }

  public async findChatRoomsByInstructorId(instructorId: string) {
    try {
      const chatRooms = await chatRoomModel.find({
        "members.userId": instructorId,
        "members.isCreator": true,
      });
      return chatRooms;
    } catch (error) {
      throw error;
    }
  }

  public async findChatRoomById(chatRoomId: string) {
    try {
      const chatRoom = await chatRoomModel.findById(chatRoomId);
      return chatRoom;
    } catch (error) {
      throw error;
    }
  }

  public async findChatRoomByCourseId(courseId: string) {
    try {
      const chatRoom = await chatRoomModel.findOne({ courseId });
      return chatRoom;
    } catch (error) {
      console.log(error)
      throw error;
    }
  }
}

export default ChatRepository;
