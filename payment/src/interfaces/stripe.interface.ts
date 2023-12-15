import { PaymentInfo } from "./order.interface";

interface IStripeService{
    retrievePaymentIntent(payment_info: PaymentInfo): Promise<boolean>;
    newPayment(amount: number): Promise<string>;
  }

export default IStripeService;