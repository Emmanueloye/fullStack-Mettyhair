import Post from './blogModel';
import * as factory from '../../utils/handlerFactory';
import * as utils from '../../utils';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { v2 as cloudinary } from 'cloudinary';

export const createPost = factory.createOne({ Model: Post, label: 'post' });

export const getPosts = factory.getAll({ Model: Post, label: 'posts' });

export const updatePost = factory.updateOne({ Model: Post, label: 'post' });

export const getPost = factory.getOne({ Model: Post, label: 'post' });

export const deletePost = factory.deleteOne({ Model: Post, label: 'post' });

export const upload = utils.upload.single('image');

export const processImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const currentPost = await Post.findById(req.params.id);

  if (!req.file) return next();

  const processedBuffer = await sharp(req.file!.buffer)
    .resize(500, 500)
    .toFormat('png')
    .toBuffer();

  if (currentPost?.imagePublicId) {
    await cloudinary.uploader.destroy(currentPost.imagePublicId);
  }

  const file = utils.formatImageURI('png', processedBuffer);
  const resp = await cloudinary.uploader.upload(file as string);

  req.body.image = resp.secure_url;
  req.body.imagePublicId = resp.public_id;

  next();
};
