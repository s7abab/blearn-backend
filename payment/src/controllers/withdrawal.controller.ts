import { Request, Response, NextFunction } from "express";
import WithdrawalUsecase from "../usecases/withdrawal.usecase";
import ErrorHandler from "@s7abab/common/build/src/utils/ErrorHandler";

class WithdrawalController {
  private withdrawalUsecase: WithdrawalUsecase;
  constructor(withdrawalUsecase: WithdrawalUsecase) {
    this.withdrawalUsecase = withdrawalUsecase;
  }

  async withdrawMoney(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req?.user?.id;
      await this.withdrawalUsecase.withdrawMoney(userId);

      res.status(200).json({
        success: true,
        message: "Withdrawal successful",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const withdrawals = await this.withdrawalUsecase.getWithdrawals(userId);
      res.status(200).json({
        success: true,
        withdrawals,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async getPendingWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const withdrawals = await this.withdrawalUsecase.getPendingWithdrawals();
      res.status(200).json({
        success: true,
        withdrawals,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }

  async updateWithdrawalStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.body;
      console.log(userId)
      await this.withdrawalUsecase.updateWithdrawalStatus(userId);
      res.status(200).json({
        success: true,
        message: "Withdrawal status updated successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, error.statusCode || 500));
    }
  }
}

export default WithdrawalController;
