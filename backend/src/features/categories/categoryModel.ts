import { InferSchemaType, model, Query, Schema } from 'mongoose';
import Subcategory from '../subcategories/subCatModel';

const categorySchema = new Schema({
  category: {
    type: String,
    required: [true, 'Category field is required.'],
    lowercase: true,
    unique: true,
  },
  slug: String,
  photo: {
    type: String,
  },
  photoPublicId: String,
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
});

type CategoryType = InferSchemaType<typeof categorySchema>;

categorySchema.pre(/^find/, function (this: Query<{}, CategoryType>) {
  this.populate({ path: 'createdBy', select: 'fullName' }).populate({
    path: 'updatedBy',
    select: 'fullName',
  });
});

categorySchema.pre('deleteOne', async function (this: Query<{}, CategoryType>) {
  const deletedDoc = await this.model.findOne(this.getFilter());

  if (deletedDoc) {
    await Subcategory.deleteMany({ category: deletedDoc._id });
  }
});

export default model('Category', categorySchema);
