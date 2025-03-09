import { model, Schema } from 'mongoose';

const paymentSchema = new Schema({
  amountPaid: {
    type: Number,
    required: [true, 'Specify amount paid.'],
  },
  paymentId: {
    type: String,
    required: [true, 'Payment Id is required.'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isFullySettled: {
    type: Boolean,
    default: false,
  },
  UnsettledAmt: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('Payment', paymentSchema);
