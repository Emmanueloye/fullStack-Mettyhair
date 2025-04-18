import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const expenseHeadSchema = new Schema({
  headId: {
    type: String,
    required: [true, 'Head id is required.'],
  },
  description: {
    type: String,
    required: [true, 'Expense head description field is required.'],
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  createdBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
  updatedAt: {
    type: Date,
  },
  updatedBy: {
    type: Types.ObjectId,
    ref: 'User',
  },
});

type ExpenseHeadtype = InferSchemaType<typeof expenseHeadSchema>;

expenseHeadSchema.pre(/^find/, function (this: Query<{}, ExpenseHeadtype>) {
  this.populate({ path: 'createdBy', select: 'fullName' }).populate({
    path: 'updatedBy',
    select: 'fullName',
  });
});

export default model('ExpenseHead', expenseHeadSchema);
