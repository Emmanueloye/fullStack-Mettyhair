import { Request } from 'express';
import * as AppError from '../errors/appError';

const fieldCheck = ({
  req,
  includedFields,
  excludedFields,
}: {
  req: Request;
  includedFields?: string[];
  excludedFields?: string[];
}) => {
  // Create a copy of the request body
  const incomingReqBody: Record<string, any> = { ...req.body };

  // Create a new object variable to store the manupulated the incoming request body.
  let acceptedBodyObj: Record<string, any> = {};

  if (includedFields && excludedFields) {
    throw new AppError.ConflictError(
      'You can only specify either includedFields or excludedFields'
    );
  }

  // If includedFields is set, manupulate the incoming request body to delete fields not specified in the includedFields array.
  if (includedFields) {
    includedFields.map((el) => {
      if (incomingReqBody.hasOwnProperty(el)) {
        acceptedBodyObj[el] = incomingReqBody[el];
      }
    });
  }

  // If exludedFields is set, manupulate the incoming request body to delete fields specified in the includedFields array.
  if (excludedFields) {
    excludedFields.forEach((el) => {
      if (incomingReqBody.hasOwnProperty(el)) {
        delete incomingReqBody[el];
      }
      acceptedBodyObj = { ...incomingReqBody };
    });
  }

  if (!includedFields && !excludedFields) {
    acceptedBodyObj = { ...req.body };
  }

  return acceptedBodyObj;
};

export default fieldCheck;
