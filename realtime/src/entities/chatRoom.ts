import IMessage from "./message";

interface IChatRoom {
  name: string;
  admins: [{}];
  members: [{}];
  messages: [IMessage];
}

export default IChatRoom;
