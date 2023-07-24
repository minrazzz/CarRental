import { model, Schema } from 'mongoose'

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: 'Car'
    },
    totalPrice: Number,
    startDate: Date,
    purchase_order_name: String,
    mobile: Number,
    endDate: Date,
    status: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked'
    },
    pickupLocation: {
      lng: Number,
      lat: Number
    },
    dropoffLocation: {
      lng: Number,
      lat: Number
    }
  },
  { timestamps: true }
)
bookingSchema.pre(/^find/, function (next) {
  this.populate({ path: 'user', select: '-password' })
  this.populate('car')
  next()
})
export const BookingModel = model('Booking', bookingSchema)
