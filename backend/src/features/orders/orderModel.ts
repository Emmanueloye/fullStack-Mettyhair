import { InferSchemaType, model, Query, Schema } from 'mongoose';

const orderSchema = new Schema(
  {
    orderNo: {
      type: String,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalCost: Number,
    amountPaid: {
      type: [Number],
    },
    customerName: {
      type: String,
      required: true,
    },
    orderName: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    transactionId: {
      type: String,
      // required: true,
    },
    invoiceNo: {
      type: String,
      // required: true,
    },
    reference: String,
    charges: Number,
    cardType: String,
    bank: String,
    currency: String,
    paymentDate: [Date],
    orderStatus: {
      type: String,
      default: 'pending',
      enum: {
        values: ['pending', 'confirmed', 'delivered', 'cancelled', 'invoiced'],
        message: 'Invalid order status',
      },
    },
    address: String,
    phone: String,
    state: String,
    country: String,
    note: String,
    confirmationDate: Date,
    confirmedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    deliveryDate: Date,
    deliveredBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    invoiceDate: Date,
    invoicedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isManual: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      default: 'unpaid',
      enum: ['paid', 'unpaid', 'partial'],
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual('orderItems', {
  localField: '_id',
  foreignField: 'orderId',
  ref: 'OrderItems',
});

type IOrder = InferSchemaType<typeof orderSchema>;

orderSchema.pre(/^find/, function (this: Query<{}, IOrder>) {
  this.populate({ path: 'user', select: 'email fullName' })
    .populate({
      path: 'confirmedBy',
      select: 'fullName',
    })
    .populate({ path: 'deliveredBy', select: 'fullName' });
});

export default model('Order', orderSchema);
