import { Schema, model } from 'mongoose';

const stateSchema = new Schema({
  state: String,
  stateId: Number,
  countryId: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

stateSchema.index({ countryId: 1 });

export default model('State', stateSchema);
