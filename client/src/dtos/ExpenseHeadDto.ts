export type ExpenseHeadType = {
  _id: string;
  headId: string;
  description: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: {
    _id: string;
    fullName: string;
  };
  updateAt: Date;
  updatedBy: {
    _id: string;
    fullName: string;
  };
};

export type ExpenseType = {
  _id: string;
  journalId: string;
  expenseId: string;
  expenseHead: {
    _id: string;
    description: string;
  };
  description: string;
  amount: number;
  postedBy: string;
  createdAt: Date;
};

export type ExpenseSummaryType = {
  _id: string;
  totalAmount: number;
};
