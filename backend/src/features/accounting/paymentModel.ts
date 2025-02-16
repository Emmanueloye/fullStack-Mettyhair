import { model, Schema } from 'mongoose';

const paymentSchema = new Schema({
  amountPaid: {
    type: Number,
    required: [true, 'Specify amount paid.'],
  },
  invoiceNO: String,
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  settledInvoice: [String],
  isPayment: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default model('Payment', paymentSchema);
