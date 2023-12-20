import { Roles, authorizeRoles, isAuthenticated } from "@s7abab/common";
import express, { Request, Response, NextFunction } from "express";
import WithdrawalUsecase from "../../usecases/withdrawal.usecase";
import WithdrawalRepository from "../../repositories/withdrawal.repository";
import WithdrawalController from "../../controllers/withdrawal.controller";

const router = express.Router();

const withdrawalRepository = new WithdrawalRepository();
const withdrawalUsecase = new WithdrawalUsecase(withdrawalRepository);
const withdrawalController = new WithdrawalController(withdrawalUsecase);

router.post(
  "/withdraw-money",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    withdrawalController.withdrawMoney(req, res, next);
  }
);

router.get(
  "/get-withdrawals/:userId",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    withdrawalController.getWithdrawals(req, res, next);
  }
);

router.get(
  "/get-pending-withdrawals",
  isAuthenticated,
  authorizeRoles(Roles.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    withdrawalController.getPendingWithdrawals(req, res, next);
  }
);

router.put(
  "/update-withdrawal-status",
  isAuthenticated,
  (req: Request, res: Response, next: NextFunction) => {
    withdrawalController.updateWithdrawalStatus(req, res, next);
  }
);

export default router;
