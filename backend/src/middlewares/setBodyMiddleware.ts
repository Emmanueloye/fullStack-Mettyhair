import { NextFunction, Request, Response } from 'express';

export const setCreationDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.createdAt) req.body.createdAt = new Date(Date.now());
  if (!req.body.createdBy) req.body.createdBy = req.user!.id;

  next();
};

export const setUpdateDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.updatedAt) req.body.updatedAt = new Date(Date.now());
  if (!req.body.updatedBy) req.body.updatedBy = req.user!.id;

  next();
};
