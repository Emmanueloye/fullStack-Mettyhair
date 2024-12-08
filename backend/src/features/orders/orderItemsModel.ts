import { InferSchemaType, model, Query, Schema } from 'mongoose';

const orderItemsSchema = new Schema({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  orderNo: {
    type: String,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  sellingPrice: {
    type: Number,
  },
  discountPrice: {
    type: Number,
  },
  costPrice: Number,
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

type IOrderItem = InferSchemaType<typeof orderItemsSchema>;

orderItemsSchema.pre(/^find/, function (this: Query<{}, IOrderItem>) {
  this.populate({ path: 'productId', select: 'productName productImage' });
});

export default model('OrderItems', orderItemsSchema);
