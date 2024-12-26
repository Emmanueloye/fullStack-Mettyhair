import { Schema } from 'mongoose';

const SalesOrderSchema = new Schema({
  salesOrderNo: {
    type: String,
    required: [true, 'Order number field is required.'],
  },
  subtotal: {
    type: Number,
    required: [true, 'Subtotal field is required.'],
  },
  discount: Number,
  totalAmount: {
    type: Number,
    required: [true, 'Total amount field is required.'],
  },
  amountPaid: Number,
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'invoiced', 'paid', 'unpaid'],
  },
});
