import { Exchanges } from "../frameworks/rabbitmq/exchanges";
import EventPublisher from "../frameworks/rabbitmq/publisher";
import { Topics } from "../frameworks/rabbitmq/topics";
import StripeService from "../frameworks/utils/stripeService";
import { IOrderRequest } from "../interfaces/order.interface";
import PaymentRepository from "../repositories/payment.repository";

class PaymentUsecase {
  private paymentRepository: PaymentRepository;
  private stripeService: StripeService;
  private eventPublisher: EventPublisher;
  constructor(
    paymentRepository: PaymentRepository,
    stripeService: StripeService,
    eventPublisher: EventPublisher
  ) {
    this.paymentRepository = paymentRepository;
    this.stripeService = stripeService;
    this.eventPublisher = eventPublisher;
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
      const data = {
        topic: Topics.ORDER_CREATE,
        userId: order.userId,
        courseId: order.courseId,
        price: order.price,
        payment_status: order.payment_status,
      };
      // publish order create event
      await this.eventPublisher.publish(
        Exchanges.PAYMENT_EXCHANGE,
        Topics.ORDER_CREATE,
        data
      );

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
