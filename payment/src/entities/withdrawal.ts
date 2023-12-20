interface IWithdrawal {
  userId: string;
  amount: number;
  txid: number | string;
  date: string;
  status: string;
}

export default IWithdrawal;
