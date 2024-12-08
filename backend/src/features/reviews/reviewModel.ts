import { InferSchemaType, Model, model, Schema, Types } from 'mongoose';
import Product from '../products/productModel';
import { Query } from 'mongoose';

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: [true, 'Rating field is required.'],
      min: [1, 'Rating must be at least one (1).'],
      max: [5, 'Rating cannot be more than five (5).'],
    },
    review: {
      type: String,
      required: [true, 'Review field is required.'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: Date,
    isRejected: {
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

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Schema type
type IReview = InferSchemaType<typeof reviewSchema>;

interface ReviewModel extends Model<IReview> {
  calcReviewMetrics: (product: Types.ObjectId) => void;
}

// Calculate number of review and average rating and save it in product collection.
reviewSchema.statics.calcReviewMetrics = async function (productId) {
  const metrics = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        numOfReview: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  await Product.findByIdAndUpdate(
    productId,
    {
      numOfReview: metrics?.at(0)?.numOfReview || 0,
      averageRating: Math.round(metrics?.at(0)?.averageRating) || 0,
    },
    { new: true }
  );
};

// Update the calculation on create/save
reviewSchema.post('save', function () {
  const model = this.constructor as ReviewModel;
  model.calcReviewMetrics(this.product as Types.ObjectId);
});

// Update the calculation on update.
reviewSchema.pre('findOneAndUpdate', async function () {
  // Get the currently updated document and pass it to the post middleware.
  (this as any).review = await this.model.findOne(this.getQuery());
});

reviewSchema.post('findOneAndUpdate', async function () {
  await (this as any).review.constructor.calcReviewMetrics(
    (this as any).review.product
  );
});

// Update the calculation on delete
reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  const model = this.constructor as ReviewModel;
  model.calcReviewMetrics(this.product as Types.ObjectId);
});

reviewSchema.pre(/^find/, function (this: Query<{}, IReview>) {
  this.populate({ path: 'user', select: 'fullName photo email' }).populate({
    path: 'approvedBy',
    select: 'fullName',
  });
});

export default model('Review', reviewSchema);
