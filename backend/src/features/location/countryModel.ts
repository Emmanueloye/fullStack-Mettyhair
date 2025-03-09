import {Schema, model} from 'mongoose'

const countrySchema = new Schema({
    country: String,
    countryCode: String,
    countryId: Number,
    createdAt: {
        type:Date,
        default: Date.now()
    }
})

export default model('Country', countrySchema)