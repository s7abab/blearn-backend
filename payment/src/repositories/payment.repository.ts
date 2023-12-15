import Order from "../entities/order";
import orderModel from "../frameworks/models/order.model";
import IPaymentRepository from "../interfaces/repository/payment.interface";

class PaymentRepository implements IPaymentRepository {
  constructor() {}

  async createOrder({ userId, courseId, payment_status, price }: Order) {
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

export default PaymentRepository;
