import { Request, Response } from 'express';
import Contact from './contactModel';
import ContactReply from './contactReplyModel';
import User from '../authentication/userModel';
import * as utils from '../../utils';
import statusCodes from '../../errors/statusCodes';
import * as factory from '../../utils/handlerFactory';

export const contactUs = async (req: Request, res: Response) => {
  const { email, fullName, message, subject } = req.body;

  await Contact.create({ email, fullName, message, subject });

  const superAdmins = await User.find({ role: 'super-admin' });

  const adminEmails = superAdmins.map((admin) => admin.email);

  const data = {
    name: 'Admin',
    fullName,
    email: adminEmails,
  };
  utils.Email.sendContactNotification(data);
  res.status(statusCodes.CREATED).json({
    status: 'success',
    message:
      'Thank you for reaching out. We will attend to your queries within 48hours. Please be patient with us.',
  });
};

export const getContacts = factory.getAll({
  Model: Contact,
  label: 'contacts',
});

export const getContact = factory.getOne({
  Model: Contact,
  label: 'contact',
  populateOption: { path: 'replies' },
});
export const updateContact = factory.updateOne({
  Model: Contact,
  label: 'contact',
  includedFields: ['isRead'],
});

export const deleteContact = factory.deleteOne({
  Model: Contact,
  label: 'contact',
});
