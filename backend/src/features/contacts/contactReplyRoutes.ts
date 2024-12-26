import { Router } from 'express';
import * as contactRepliesController from './contactRepliesController';

const router = Router({ mergeParams: true });

router
  .route('/')
  .post(
    contactRepliesController.switchParmas,
    contactRepliesController.createReply
  );

export default router;
