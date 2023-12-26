interface IMessage {
  senderId: string;
  messageType: "text" | "image";
  content?: string;
  fileUrl?: string;
  chatRoomId:string;
  timestamp?:string;
}

export default IMessage;