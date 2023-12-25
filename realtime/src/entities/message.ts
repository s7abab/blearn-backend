interface IMessage {
  senderId: string;
  messageType: "text" | "image";
  content?: string;
  fileUrl?: string;
  timestamp?:string;
}

export default IMessage;