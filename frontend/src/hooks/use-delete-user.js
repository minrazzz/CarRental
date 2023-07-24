import { useMutation, useQueryClient } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation(
    async userId => {
      try {
        const { data: message } = await axiosClient.delete(`/users/${userId}`)
        return message
      } catch (error) {
        throw new Error(error.response?.data?.message ?? 'Failed to delete user')
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
      }
    }
  )
}
