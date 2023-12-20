import userModel from "../frameworks/models/user.model";
import withdrawalModel from "../frameworks/models/withdrawal.model";

class WithdrawalRepository {
  constructor() {}

  async findAndWithdraw(userId: string) {
    try {
      const user = await userModel.findById(userId);
      if (!user) throw new Error("User not found");
      const balance = user.balance;
      const isPending = await withdrawalModel.findOne({
        userId: userId,
        status: "pending",
      });
      if (isPending) {
        throw new Error("Withdrawal is already pending");
      }
      if (balance == 0) {
        throw new Error("Insufficient balance");
      }
      // clear the balance
      user.balance = 0;
      // add profit
      user.profit = user.profit + balance;
      // save transaction details
      const date = new Date();
      const transactionId = Math.random().toString(36).substring(2, 9);
      const withdrawal = await withdrawalModel.create({
        userId: userId,
        amount: balance,
        txid: transactionId,
        date: date.toISOString(),
        status: "pending",
      });
      await user.save();
      await withdrawal.save();
      return withdrawal;
    } catch (error) {
      throw error;
    }
  }

  async findWithdrawals(userId: string) {
    try {
      const withdrawals = await withdrawalModel.find({ userId: userId });
      const user = await userModel.findById(userId);
      if (!user) throw new Error("User not found");
      const balance = user.balance;

      const withdrawalsData = {
        withdrawals,
        balance,
      };
      return withdrawalsData;
    } catch (error) {
      throw error;
    }
  }

  async findPendingWithdrawals() {
    try {
      const withdrawals = await withdrawalModel.find({
        status:"pending"
      });
      return withdrawals;
    } catch (error) {
      throw error;
    }
  }

  async findTransactionAndMarkAsPaid(userId: string) {
    try {
      const withdrawal = await withdrawalModel.findOneAndUpdate(
        { userId: userId, status: "pending" },
        { status: "paid" }
      );

      return withdrawal;
    } catch (error) {
      throw error
    }
  }
}
export default WithdrawalRepository;
