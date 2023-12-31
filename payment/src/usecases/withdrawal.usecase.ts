import WithdrawalRepository from "../repositories/withdrawal.repository";

class WithdrawalUsecase {
  private withdrawalRepository: WithdrawalRepository;
  constructor(withdrawalRepository: WithdrawalRepository) {
    this.withdrawalRepository = withdrawalRepository;
  }

  public async withdrawMoney(userId: string) {
    try {
      const withdrawal = await this.withdrawalRepository.findAndWithdraw(
        userId
      );
      if (!withdrawal) {
        throw new Error("Withdrawal not successfull");
      }
      return withdrawal;
    } catch (error) {
      throw error;
    }
  }

  public async getWithdrawals(userId: string) {
    try {
      const withdrawals = await this.withdrawalRepository.findWithdrawals(
        userId
      );

      return withdrawals;
    } catch (error) {
      throw error;
    }
  }

  public async getPendingWithdrawals() {
    try {
      const withdrawals =
        await this.withdrawalRepository.findPendingWithdrawals();
      return withdrawals;
    } catch (error) {
      throw error;
    }
  }

  public async updateWithdrawalStatus(userId: string) {
    try {
      const withdrawal =
        await this.withdrawalRepository.findTransactionAndMarkAsPaid(userId);
      if (!withdrawal) {
        throw new Error("Withdrawal not successfull");
      }

      return withdrawal;
    } catch (error) {
      throw error;
    }
  }
}

export default WithdrawalUsecase;
