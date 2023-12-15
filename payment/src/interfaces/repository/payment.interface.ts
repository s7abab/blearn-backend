import Order from "../../entities/order";

interface IPaymentRepository {
  createOrder(order: Order): Promise<any>;
}

export default IPaymentRepository;