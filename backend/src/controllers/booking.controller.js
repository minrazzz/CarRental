import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import asyncHandler from 'express-async-handler'
import createError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import Stripe from 'stripe'

import { FRONTEND_URL } from '../constants'
import { BookingModel } from '../models/booking.model'
import { CarModel } from '../models/car.model'
import { TransactionModel } from '../models/transaction.model'
import { UserModel } from '../models/user.model'
import axios from 'axios'

dayjs.extend(LocalizedFormat)

const stripeInstance = () =>
  new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27'
  })
const isCarAvailableForBooking = (car, startDate) => {
  if (car.isBooked) {
    return new Date(startDate) > new Date(car.bookedUntill)
  }
  return true
}
export const findAll = asyncHandler(async (req, res, next) => {
  const bookings = await BookingModel.find({ user: req.user._id })
  res.json(bookings)
})
export const cancelBooking = asyncHandler(async (req, res, next) => {
  /**
   * 1. Find the booking
   * 2. Find the car associated with the booking
   * 3. Update the car's isBooked,bookedFrom and bookedUntill fields
   * 4. Set booking status to CANCELLED
   */
  const { bookingId } = req.params
  const booking = await BookingModel.findById(bookingId)
  if (!booking) return next(createError(StatusCodes.NOT_FOUND, 'Booking not found'))

  await CarModel.findByIdAndUpdate(booking.car._id, {
    isBooked: false,
    bookedFrom: undefined,
    bookedUntill: undefined
  })
  //update booking status
  booking.status = 'cancelled'
  await booking.save()

  res.json({ message: 'Booking cancelled' })
})
export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  const car = await CarModel.findById(req.params.carId)
  if (!isCarAvailableForBooking(car, req.body.startDate)) {
    return next(
      createError(
        StatusCodes.BAD_REQUEST,
        `Car is unavailable for booking from ${dayjs(car.bookedFrom).format(
          'LL'
        )} to ${dayjs(car.bookedUntill).format('LL')}`
      )
    )
  }
  if (!car)
    return next(
      createError(
        StatusCodes.NOT_FOUND,
        'The car you are trying to book does not exist'
      )
    )
  const checkoutSession = await stripeInstance().checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${FRONTEND_URL}/profile?success=true&carName=${car.name}`,
    cancel_url: `${FRONTEND_URL}/cars/${req.params.carId}`,
    customer_email: req.user.email,
    client_reference_id: req.params.carId,
    metadata: {
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      pickupLocation: JSON.stringify(req.body.pickupLocation),
      dropoffLocation: JSON.stringify(req.body.dropoffLocation)
    },
    line_items: [
      {
        name: car.name,
        description: car.description,
        amount: car.price * 100,
        currency: 'usd',
        quantity: 1,
        images: [car.image]
      }
    ]
  })
  res.json(checkoutSession)
})
export const khaltiPayment = async (req, res, next) => {
  const car = await CarModel.findById(req.params.carId)
  const user = await UserModel.findOne({ email: req.user.email })
  if (!isCarAvailableForBooking(car, req.body.startDate)) {
    return next(
      createError(
        StatusCodes.BAD_REQUEST,
        `Car is unavailable for booking from ${dayjs(car.bookedFrom).format(
          'LL'
        )} to ${dayjs(car.bookedUntill).format('LL')}`
      )
    )
  }
  if (!car)
    return next(
      createError(
        StatusCodes.NOT_FOUND,
        'The car you are trying to book does not exist'
      )
    )
  try {
    // return url `${FRONTEND_URL}/profile?success=true&carName=${car.name}`
    const url = 'https://a.khalti.com/api/v2/epayment/initiate/'
    const payload = {
      return_url: `http://localhost:3000/Confirm`,
      website_url: `${FRONTEND_URL}`,
      amount: car.price,
      purchase_order_id: req.params.carId,
      purchase_order_name: car.name,
      customer_info: {
        name: 'manoj bastakoti',

        email: req.user.email
      },
      //   amount_breakdown: [
      //     {
      //       label: 'Mark Price',
      //       amount: amount,
      //     },
      //     {
      //       label: 'VAT',
      //       amount: 300,
      //     },
      //   ],
      product_details: [
        {
          identity: '1234567890',
          name: 'Khalti logo',
          total_price: car.price,
          quantity: 1,
          unit_price: car.price
        }
      ]
      // metadata: {
      //   startDate: req.body.startDate,
      //   endDate: req.body.endDate,
      //   pickupLocation: JSON.stringify(req.body.pickupLocation),
      //   dropoffLocation: JSON.stringify(req.body.dropoffLocation)
      // }
    }
    const headers = {
      Authorization: 'Key 2139c7f21d004fcc9f7a7e4acb867298',
      'Content-Type': 'application/json'
    }

    await BookingModel.create({
      car: req.params.carId,
      user: user._id,
      totalPrice: car.price
    })

    axios
      .post(url, payload, { headers })
      .then(response => {
        // Process the response
        const { pidx, payment_url, expires_at, expires_in } = response.data
        const carData = response.data
        console.log(response.data)
        // Redirect the user to the payment_url
        res.json({
          pidx,
          payment_url,
          expires_at,
          expires_in,
          carData
        })
        // ...
      })
      .catch(error => {
        // Handle the error
        if (error.response) {
          // Request was made and server responded with a status code outside the range of 2xx
          console.error('Request failed with status:', error.response.status)
          console.error('Response data:', error.response.data)
        } else if (error.request) {
          // Request was made but no response was received
          console.error('No response received:', error.request)
        } else {
          // Something else happened while setting up the request
          console.error('Error setting up the request:', error.message)
        }
      })
  } catch (error) {
    console.log('error within api', error)
  }
}
export const webhooks = asyncHandler(async (req, res, next) => {
  const signature = req.headers['stripe-signature']
  const event = stripeInstance().webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  )
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const carId = session.client_reference_id
    const user = await UserModel.findOne({ email: session.customer_email })
    const totalPrice = session.amount_total / 100
    const { startDate, endDate } = session.metadata
    const pickupLocation = JSON.parse(session.metadata.pickupLocation)
    const dropoffLocation = JSON.parse(session.metadata.dropoffLocation)

    //create a transaction
    await TransactionModel.create(session)

    // update the booking details of the car
    try {
      await CarModel.findByIdAndUpdate(carId, {
        isBooked: true,
        bookedFrom: startDate,
        bookedUntill: endDate
      })
    } catch (error) {
      console.log(error)
    }
    await BookingModel.create({
      car: carId,
      user: user._id,
      totalPrice,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation
    })
  }
  res.status(StatusCodes.OK).json({ received: true })
})

export const bookingDetails = async (req, res, next) => {
  const carId = req.body.purchaseOrderId
  // const { totalAmount, purchase_order_name, mobile } = req.body
  // const user = await UserModel.findOne({ email: req.user.email })
  console.log('hello', carId)
  res.json({
    carId
  })
  // try {
  //   await CarModel.findByIdAndUpdate(carId, {
  //     isBooked: true,
  //     bookedFrom: startDate,
  //     bookedUntill: endDate
  //   })
  //   const booking = await BookingModel.create({
  //     car: carId,
  //     user: user._id,
  //     totalPrice: totalAmount,
  //     purchase_order_name,
  //     mobile
  //   })
  //   res.status(200).json({
  //     booking
  //   })
  // } catch (error) {
  //   console.log(error)
  // }
}
