import { useMutation } from 'react-query'

import { useUser } from '../../../hooks/use-user'
import { autoLogin } from '../../../utils/auth'
import { axiosClient } from '../../../utils/axios-client'

export const useRegister = () => {
  const { refetch } = useUser()
  return useMutation(async registerPayload => {
    try {
      const { data } = await axiosClient.post('/users/signup', registerPayload)
      autoLogin(data.accessToken)
      await refetch()
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Failed to register')
    }
  })
}
