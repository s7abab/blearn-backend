export enum PaymentStatus {
  PENDING = "incomplete",
  COMPLETED = "succeeded",
  FAILED = "failed",
}

export interface IOrder {
  userId: string;
  courseId: string;
  price: number;
  payment_status: string;
  payment_info: {
    amount: number;
    status: string;
  };
}
