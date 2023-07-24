import { loadStripe } from '@stripe/stripe-js'
import { useMutation } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useCheckout = () => {
  return useMutation(async checkoutPayload => {
    const { carId } = checkoutPayload
    // const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    try {
      const { data } = await axiosClient.post(
        `/bookings/khalti-payment/${carId}`
        // rest
      )
      console.log(data)
      const { payment_url } = data
      window.location.href = payment_url

      // const result = await stripe.redirectToCheckout({ sessionId: session.id })
      // console.log(result)
      // if (result.error) throw new Error(result.error.message)
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Something went wrong')
    }
  })
}
