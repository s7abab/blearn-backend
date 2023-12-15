import StripeService from "../frameworks/utils/stripeService";
import { IOrderRequest } from "../interfaces/order.interface";
import PaymentRepository from "../repositories/payment.repository";

class PaymentUsecase {
  private paymentRepository: PaymentRepository;
  private stripeService : StripeService
  constructor(
    paymentRepository: PaymentRepository,
    stripeService: StripeService
  ) {
    this.paymentRepository = paymentRepository;
    this.stripeService = stripeService;
  }

  async createOrder({ courseId, payment_info }: IOrderRequest, userId: string) {
    try {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(
        payment_info
      );

      const price = payment_info.amount / 100;

      const order = await this.paymentRepository.createOrder({
        courseId: courseId,
        userId: userId,
        price: price,
        payment_status: payment_info.status,
      });

      if (!order) {
        throw new Error("Error while creating order");
      }
      return order;
    } catch (error) {
      throw error;
    }
  }

  async newPayment(amount: number) {
    try {
      const client_secret = await this.stripeService.newPayment(amount);
      if (!client_secret) {
        throw new Error("Error while creating payment");
      }
      return client_secret;
    } catch (error) {
      throw error;
    }
  }
}
export default PaymentUsecase;
