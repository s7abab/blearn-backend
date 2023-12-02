import { IOrder } from "../@types/modelTypes/order";
import orderModel from "../models/order.model";

class PaymentRepository {
  constructor() {}

  async createOrder({ userId, courseId, payment_status, price }: IOrder) {
    try {
      const order = await orderModel.create({
        userId,
        courseId,
        payment_status,
        price,
      });
      return order;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default new PaymentRepository();
