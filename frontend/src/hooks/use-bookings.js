import { useQuery } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useBookings = () => {
  return useQuery('bookings', async () => {
    try {
      const { data: bookings } = await axiosClient.get('/bookings')
      return bookings
    } catch (error) {
      throw new Error(error.response?.data?.message)
    }
  })
}
