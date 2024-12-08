import { InferSchemaType, model, Schema, Types } from 'mongoose';

const tokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isValid: {
      type: Boolean,
      default: true,
      required: true,
    },
    userIP: {
      type: String,
    },
    userAgent: {
      type: String,
      required: true,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

export type IToken = InferSchemaType<typeof tokenSchema>;

export default model<IToken>('Token', tokenSchema);
