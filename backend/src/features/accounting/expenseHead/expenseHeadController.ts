import ExpenseHead from './expenseHeadModel';
import * as factory from '../../../utils/handlerFactory';
import { NextFunction, Request, Response } from 'express';
import ShortUniqueId from 'short-unique-id';
import { body } from 'express-validator';

export const createExpenseHead = factory.createOne({
  Model: ExpenseHead,
  label: 'expenseHead',
  includedFields: ['headId', 'description', 'createdBy'],
});

export const getExpenseHeads = factory.getAll({
  Model: ExpenseHead,
  label: 'expenseHeads',
});

export const getExpenseHead = factory.getOne({
  Model: ExpenseHead,
  label: 'expenseHead',
});

export const updateExpenseHead = factory.updateOne({
  Model: ExpenseHead,
  label: 'expenseHead',
});

export const deleteExpenseHead = factory.deleteOne({
  Model: ExpenseHead,
  label: 'expenseHead',
});

export const CreateExpenseHeadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const uid = new ShortUniqueId({ length: 8 });
  if (!req.body.headId) req.body.headId = uid.rnd();
  if (!req.body.createdBy) req.body.createdBy = req?.user?.id;
  next();
};

export const updateExpenseHeadMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.updatedAt) req.body.updatedAt = Date.now();
  if (!req.body.updatedBy) req.body.updatedBy = req.user?.id;
  next();
};
