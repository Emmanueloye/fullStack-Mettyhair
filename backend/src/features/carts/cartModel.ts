import { InferSchemaType, model, Query, Schema } from 'mongoose';

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    cartId: String,
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      min: [1, 'Quantity must be at least one.'],
    },
    color: String,
    size: String,
  },
  { timestamps: true }
);

export type ICart = InferSchemaType<typeof cartSchema>;

cartSchema.pre(/^find/, function (this: Query<{}, ICart>) {
  this.populate({
    path: 'product',
    select:
      'productName productImage sellingPrice discountPrice quantity slug costPrice',
  });
});

export default model('Cart', cartSchema);
