import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name field is required.'],
    },
    email: {
      type: String,
      required: [true, 'Email field is required.'],
    },

    subject: {
      type: String,
      required: [true, 'Subject field is required.'],
    },
    message: {
      type: String,
      required: [true, 'Message field is required.'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    repliedTo: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

contactSchema.virtual('replies', {
  ref: 'ContactReply',
  localField: '_id',
  foreignField: 'contactId',
});

export default model('Contact', contactSchema);
