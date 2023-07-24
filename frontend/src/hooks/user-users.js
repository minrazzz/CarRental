import { useQuery } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useUsers = () => {
  return useQuery('users', async () => {
    try {
      const users = await axiosClient.get('/users')
      return users.data
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Failed to fetch users')
    }
  })
}
