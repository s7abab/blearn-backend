import { IOrder } from "../@types/order.types";
import prisma from "../config/prismaClient";

class PaymentRepository {
  constructor() {}

  async createOrder({ userId, courseId, payment_status, price }: IOrder) {
    try {
      const order = await prisma.order.create({
        data: {
          userId,
          courseId,
          payment_status,
          price,
        },
      });
      return order;
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
    }
  }
}

export default new PaymentRepository();
