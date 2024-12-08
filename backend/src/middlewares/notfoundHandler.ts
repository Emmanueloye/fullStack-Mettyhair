import * as AppError from '../errors/appError';
import { Request, Response } from 'express';

const notFoundMiddleware = (req: Request, res: Response) => {
  throw new AppError.NotFoundError('This page does not exist on our server.');
};

export default notFoundMiddleware;
