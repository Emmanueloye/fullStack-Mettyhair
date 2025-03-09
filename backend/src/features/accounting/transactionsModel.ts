import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const transactionSchema = new Schema(
  {
    orderId: {
      type: Types.ObjectId,
      ref: 'Order',
    },
    paymentId: {
      type: Types.ObjectId,
      ref: 'Payment',
    },
    amount: {
      type: Number,
      required: [true, 'Amount field is required.'],
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

type TransactionTypes = InferSchemaType<typeof transactionSchema>;
transactionSchema.pre(/^find/, function (this: Query<{}, TransactionTypes>) {
  this.populate({ path: 'orderId', select: 'invoiceNo' }).populate({
    path: 'paymentId',
    select: 'paymentId',
  });
});

export default model('Transaction', transactionSchema);
