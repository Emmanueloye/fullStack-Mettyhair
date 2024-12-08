import express from 'express';
import { Request } from 'express';
import { UserTypes } from '../../src/features/authentication/userModel';
import { Types } from 'mongoose';

type User = UserTypes & {
  id?: Types.ObjectId;
  access?: { permittedRoutes?: string[] };
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
