import { useMutation } from 'react-query'

import { axiosClient } from '../utils/axios-client'
import { useUser } from './use-user'

export const useUpdateUserProfile = () => {
  const { refetch } = useUser()
  return useMutation(async updateUserPayload => {
    try {
      const { data } = await axiosClient.post('/users/profile', updateUserPayload)
      await refetch()
      return data
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Failed to update profile')
    }
  })
}
