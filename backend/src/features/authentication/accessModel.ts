import { Schema, InferSchemaType, Types, model } from 'mongoose';

const accessSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: 'User',
  },
  permittedRoutes: {
    type: [String],
  },
});

export type AccessTypes = InferSchemaType<typeof accessSchema>;

export default model('AccessDb', accessSchema);
