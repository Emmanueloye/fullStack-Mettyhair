import { model, Schema } from 'mongoose';

const blogSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title field is required.'],
    trim: true,
    lowercase: true,
    unique: true,
  },
  content: {
    type: String,
    required: [true, 'Blog content is required.'],
  },
  image: {
    type: String,
    required: [true, 'Blog image is required.'],
  },
  imagePublicId: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: Date,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

export default model('Post', blogSchema);