import { Schema, model } from 'mongoose';

const citySchema = new Schema({
  city: String,
  cityId: Number,
  stateId: Number,
  countryId: Number,
});

citySchema.index({ stateId: 1 });
export default model('City', citySchema);
