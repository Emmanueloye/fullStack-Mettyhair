export type StatmentTypes = {
  _id: string;
  paymentId?: {
    _id: string;
    paymentId: string;
  };
  amount: number;
  user: string;
  date: Date;
  orderId?: {
    _id: string;
    invoiceNo: string;
  };
};

export type TransactionType = {
  status?: string;
  message: string;
  statement?: StatmentTypes[];
  openingBal: number;
};
