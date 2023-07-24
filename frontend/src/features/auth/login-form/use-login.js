import { useMutation } from 'react-query'

import { useUser } from '../../../hooks/use-user'
import { autoLogin } from '../../../utils/auth'
import { axiosClient } from '../../../utils/axios-client'

export const useLogin = () => {
  const { refetch } = useUser()
  return useMutation(async loginPayload => {
    try {
      const { data } = await axiosClient.post('/users/login', loginPayload)
      autoLogin(data.accessToken)
      refetch()
    } catch (error) {
      throw new Error(error.response?.data?.message ?? 'Login Failed')
    }
  })
}
