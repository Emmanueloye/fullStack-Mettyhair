import Expense from './expenseModel';
import * as factory from '../../../utils/handlerFactory';
import { Request, Response } from 'express';
import * as AppError from '../../../errors/appError';
import ShortUniqueId from 'short-unique-id';
import statusCodes from '../../../errors/statusCodes';

export const getAllExpenses = factory.getAll({
  Model: Expense,
  label: 'expenses',
});

export const postExpenses = async (req: Request, res: Response) => {
  validateExpense(req);
  const uid = new ShortUniqueId({ length: 8 });
  const journalId = uid.rnd();
  for (const item of JSON.parse(req.body.expenses)) {
    const { expenseHead, description, amount } = item;
    await Expense.create({
      journalId,
      expenseId: uid.rnd(),
      expenseHead,
      description,
      amount,
      postedBy: req.user?.fullName,
    });
  }
  res
    .status(statusCodes.OK)
    .json({ status: 'success', message: 'Expense posted successfully.' });
};

const validateExpense = (req: Request) => {
  const expenses = JSON.parse(req.body.expenses);

  for (const item of expenses) {
    const { expenseHead, description, amount } = item;
    if (!expenseHead) {
      throw new AppError.BadRequestError('');
    }
    if (!description) {
      throw new AppError.BadRequestError(
        'Expense description field is required.'
      );
    }
    if (!amount) {
      throw new AppError.BadRequestError('Expense amount field is required.');
    }
  }
};
