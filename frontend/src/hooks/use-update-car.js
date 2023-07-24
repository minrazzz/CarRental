import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useUpdateCar = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async updateCarPayload => {
      try {
        const { carId, ...body } = updateCarPayload
        const { data: message } = await axiosClient.patch(`/cars/${carId}`, body)
        return message
      } catch (error) {
        throw new Error(error.response?.data?.message ?? 'Failed to update car')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cars')
      }
    }
  )
}
