import ContactReply from './contactReplyModel';
import Contact from './contactModel';
import * as factory from '../../utils/handlerFactory';
import { NextFunction, Request, Response } from 'express';
import * as utils from '../../utils';
import statusCodes from '../../errors/statusCodes';
import { capitalized } from '../../utils/helperFunctions';

export const createReply = async (req: Request, res: Response) => {
  const { contactId, message } = req.body;

  await ContactReply.create({
    contactId,
    replyMessage: message,
  });

  const currentContact = await Contact.findById(req.params.contactId);

  currentContact!.repliedTo = true;
  await currentContact!.save();

  const data = {
    subject: capitalized(currentContact!.subject),
    email: currentContact?.email,
    message,
  };

  utils.Email.sendContactReply(data);
  res.status(statusCodes.CREATED).json({
    status: 'success',
    message: 'Reply has been sent to your customer.',
  });
};

export const switchParmas = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.contactId) req.body.contactId = req.params.contactId;
  next();
};
