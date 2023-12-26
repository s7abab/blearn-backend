import IMessage from "./message";

interface IChatRoom {
  name: string;
  description: string;
  courseId: string;
  members: [{ userId: string; isAdmin: boolean; isCreator: boolean }];
  messages: [IMessage];
}

export default IChatRoom;
