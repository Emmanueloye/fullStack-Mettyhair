import { InferSchemaType, model, Query, Schema, Types } from 'mongoose';

const expenseSchema = new Schema(
  {
    journalId: {
      type: String,
    },
    expenseId: {
      type: String,
      required: [
        true,
        'The system cannot generate id for your expense. Please try again later.',
      ],
    },
    expenseHead: {
      type: String,
      required: [true, 'Expense head field is required.'],
    },
    description: {
      type: String,
      required: [true, 'Description field is required.'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount field is required'],
    },
    postedBy: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Get the schema type
type ExpenseType = InferSchemaType<typeof expenseSchema>;

expenseSchema.pre(/^find/, function (this: Query<{}, ExpenseType>) {
  this.populate({ path: 'expenseHead', select: 'description' });
});

export default model('Expense', expenseSchema);
