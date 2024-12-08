import { model, Schema } from 'mongoose';

const settingSchema = new Schema(
  {
    facebook: {
      type: String,
      required: [true, 'Business facebook link is required.'],
    },
    instagram: {
      type: String,
      required: [true, 'Business instagram link is required.'],
    },
    thread: String,
    twitter: String,
    reorderLevel: {
      type: Number,
      required: [true, 'Inventory re-order level field is required.'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Business contact phone is required.'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Business contact email is required.'],
    },
  },
  { timestamps: true }
);

export default model('Setting', settingSchema);
