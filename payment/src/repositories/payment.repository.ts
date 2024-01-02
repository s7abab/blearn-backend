import Order from "../entities/order";
import orderModel from "../frameworks/models/order.model";
import userModel from "../frameworks/models/user.model";
import IPaymentRepository from "../interfaces/repository/payment.interface";

class PaymentRepository implements IPaymentRepository {
  constructor() {}

  public async createOrder({
    userId,
    courseId,
    payment_status,
    price,
    instructorId,
  }: Order) {
    try {
      const order = await orderModel.create({
        userId,
        courseId,
        payment_status,
        price,
      });

      await userModel.findByIdAndUpdate(
        instructorId,
        { $inc: { balance: price } },
        { new: true }
      );

      return order;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default PaymentRepository;
