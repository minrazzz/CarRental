import { createAxiosServerClient } from '../utils/axios-server-client'

export const fetchUser = async token => {
  const axiosClient = createAxiosServerClient(token)
  const { data } = await axiosClient.get('/users/profile')
  return data
}
