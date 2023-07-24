import { parseCookies } from 'nookies'
import { useQuery } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useUser = () => {
  const { token } = parseCookies(null)
  return useQuery(
    'user',
    async () => {
      try {
        const { data } = await axiosClient.get('/users/profile')
        return data
      } catch (error) {
        throw new Error(error.response?.data.message ?? 'Failed to fetch user')
      }
    },
    { enabled: Boolean(token) }
  )
}
