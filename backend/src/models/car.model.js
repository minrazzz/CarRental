import { model, Schema } from 'mongoose'
import minify from 'url-minify'

const carSchema = new Schema({
  name: String,
  image: String,
  description: String,
  model: String,
  numberOfSeats: Number,
  price: Number,
  isBooked: {
    type: Boolean,
    default: false
  },
  bookedFrom: Date,
  bookedUntill: Date
})
carSchema.pre('save', async function (next) {
  const { shortUrl } = await minify(this.image, { provider: 'tinyurl' })
  this.image = shortUrl
  next()
})
export const CarModel = model('Car', carSchema)
