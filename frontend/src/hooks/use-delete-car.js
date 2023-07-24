import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useDeleteCar = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async carId => {
      try {
        const { data: message } = await axiosClient.delete(`/cars/${carId}`)
        return message
      } catch (error) {
        throw new Error(error.response?.data?.message ?? 'Failed to delete car')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cars')
      }
    }
  )
}
