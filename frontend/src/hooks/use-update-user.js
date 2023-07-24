import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async updateUserPayload => {
      const { userId, ...body } = updateUserPayload
      try {
        const { data: message } = await axiosClient.patch(`/users/${userId}`, body)
        return message
      } catch (error) {
        throw new Error(error.response?.data?.message ?? 'Failed to update user')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  )
}
