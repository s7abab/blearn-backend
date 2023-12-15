import { PaymentInfo } from "../../interfaces/order.interface";
import IStripeService from "../../interfaces/stripe.interface";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class StripeService implements IStripeService {
  constructor() {}

  async retrievePaymentIntent(payment_info: PaymentInfo) {
    try {
      if (payment_info) {
        if ("id" in payment_info) {
          const paymentIntentId = payment_info.id;
          const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId
          );

          if (paymentIntent.status !== "succeeded") {
            throw new Error("Payment not authorized!");
          }
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  async newPayment(amount: number) {
    try {
      const myPayment = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "INR",
        metadata: {
          company: "B-Learn",
        },
        description: "Description of the export transaction",
        automatic_payment_methods: {
          enabled: true,
        },
      });
      const client_secret = myPayment.client_secret;
      return client_secret;
    } catch (error) {
      throw error;
    }
  }
}

export default StripeService;
