interface IOrder {
  userId: string;
  instructorId:string;
  courseId: string;
  price: number;
  payment_status: string;
}


export default IOrder;