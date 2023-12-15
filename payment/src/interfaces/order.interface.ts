export interface PaymentInfo {
  amount: number;
  status: string;
}
export interface IOrderRequest {
  courseId: string;
  payment_info: {
    status: string;
    amount: number;
  };
}
