import { Router } from 'express'

import {
  bookingDetails,
  cancelBooking,
  findAll,
  getCheckoutSession,
  khaltiPayment
} from '../controllers/booking.controller'
import { authenticated } from '../middlewares/authenticated'

const bookingRouter = Router()

bookingRouter.use(authenticated)

bookingRouter.get('/', findAll)
bookingRouter.post('/checkout-session/:carId', getCheckoutSession)
bookingRouter.get('/cancel/:bookingId', cancelBooking)
bookingRouter.get('/cancel/:bookingId', cancelBooking)
// /api/bookings/khalti-payment/:carId
bookingRouter.post('/khalti-payment/:carId', khaltiPayment)
bookingRouter.post('/details', bookingDetails)

export { bookingRouter }
