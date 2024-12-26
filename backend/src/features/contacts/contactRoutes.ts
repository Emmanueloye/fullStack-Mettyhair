import { Router } from 'express';
import * as contactController from './contactController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import contactReplyRouter from './contactReplyRoutes';

const router = Router();

router.use('/:contactId/contact-replies', contactReplyRouter);

router
  .route('/')
  .post(contactController.contactUs)
  .get(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    contactController.getContacts
  );

router.use(
  authMiddleware.protect,
  authMiddleware.restrictTo('admin', 'super-admin')
);
router
  .route('/:id')
  .patch(contactController.updateContact)
  .get(contactController.getContact)
  .delete(contactController.deleteContact);

export default router;
