import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useAddCar = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async addCarPayload => {
      try {
        const { data: message } = await axiosClient.post('/cars', addCarPayload)
        return message
      } catch (error) {
        throw new Error(error.response?.data?.message ?? 'Failed to add car')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('cars')
      }
    }
  )
}
