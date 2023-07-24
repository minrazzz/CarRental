import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../../utils/axios-client'

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation(async cancelBookingPayload => {
    const { bookingId, carId } = cancelBookingPayload
    try {
      const { data } = await axiosClient.get(`/bookings/cancel/${bookingId}`)
      await queryClient.invalidateQueries('bookings')
      await queryClient.invalidateQueries(['cars', carId])
      return data.message
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Failed to cancel booking')
    }
  })
}
