import compression from 'compression'
import cors from 'cors'
import express from 'express'

import { webhooks } from './controllers/booking.controller'
import { globalErrorHandler } from './middlewares/global-error-handler'
import { bookingRouter } from './routes/booking.routes'
import { carRouter } from './routes/car.routes'
import transactionRouter from './routes/transaction.routes'
import { userRouter } from './routes/user.routes'

const app = express()

app.use(compression())
//enable cors
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://motoinc-car-rental-morgantuber.vercel.app'
    ],
    credentials: true
  })
)
//register middlewares

if (process.env.NODE_ENV === 'development') {
  import('morgan').then(({ default: morgan }) => {
    app.use(morgan('dev'))
  })
}
app.post('/api/bookings/webhooks', express.raw({ type: '*/*' }), webhooks)
app.use(express.json())

//register routes
app.get('/', (req, res, next) => {
  res.send(`<h1>Welcome to MotoInc Car Rental API</h1>`)
})
app.use('/api/users', userRouter)
app.use('/api/cars', carRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/transactions', transactionRouter)

//global error handling middleware
app.use(globalErrorHandler)

export { app }
