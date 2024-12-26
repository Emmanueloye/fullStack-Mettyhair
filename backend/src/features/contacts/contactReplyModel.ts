import { model, Schema } from 'mongoose';

const contactReplySchema = new Schema({
  contactId: {
    type: Schema.Types.ObjectId,
    ref: 'Contact',
  },
  replyMessage: {
    type: String,
    required: [true, 'Message is required.'],
  },
  replyDate: {
    type: Date,
    default: Date.now(),
  },
});

export default model('ContactReply', contactReplySchema);
