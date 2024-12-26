import { Router } from 'express';
import * as blogController from './blogController';
import * as authMiddleware from '../../middlewares/authMiddleware';
import * as setBodyMiddleware from '../../middlewares/setBodyMiddleware';

const router = Router();

router
  .route('/')
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    blogController.upload,
    blogController.processImage,
    setBodyMiddleware.setCreationDetails,
    blogController.createPost
  )
  .get(blogController.getPosts);

router
  .route('/:id')
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    blogController.upload,
    blogController.processImage,
    setBodyMiddleware.setUpdateDetails,
    blogController.updatePost
  )
  .get(blogController.getPost)
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin', 'super-admin'),
    blogController.deletePost
  );

export default router;
