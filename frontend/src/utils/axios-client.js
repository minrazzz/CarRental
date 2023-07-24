import axios from 'axios'
import { parseCookies } from 'nookies'

import { getBackendUrl } from './get-backend-url'

const createAxiosClient = () => {
  const axiosClient = axios.create({
    baseURL: getBackendUrl(),
    withCredentials: true
  })
  const { token } = parseCookies(null)
  if (token) axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
  return axiosClient
}
export const axiosClient = createAxiosClient()
