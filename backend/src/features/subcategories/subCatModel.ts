import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const subCategorySchema = new Schema({
  subcategory: {
    type: String,
    required: [true, 'Subcategory field is required.'],
    unique: true,
    lowercase: true,
  },
  slug: String,
  category: {
    type: Types.ObjectId,
    ref: 'Category',
  },
  createdAt: Date,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  updatedAt: Date,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

type SubCatType = InferSchemaType<typeof subCategorySchema>;

subCategorySchema.pre(/^find/, function (this: Query<{}, SubCatType>) {
  this.populate({ path: 'category', select: 'category' })
    .populate({
      path: 'createdBy',
      select: 'fullName',
    })
    .populate({ path: 'updatedBy', select: 'fullName' });
});

export default model('Subcategory', subCategorySchema);
