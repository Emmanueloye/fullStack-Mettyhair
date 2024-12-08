import { InferSchemaType, model, Query, Schema } from 'mongoose';

const sliderSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Slider title field is required'],
  },
  description: {
    type: String,
    required: [true, 'Slider description field is required.'],
  },
  image: {
    type: String,
    required: [true, 'Slider image field is required'],
  },
  imagePublicId: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
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

type ISlider = InferSchemaType<typeof sliderSchema>;

sliderSchema.pre(/^find/, function (this: Query<{}, ISlider>) {
  this.populate({ path: 'createdBy', select: 'fullName' }).populate({
    path: 'updatedBy',
    select: 'fullName',
  });
});

export default model('Slider', sliderSchema);
