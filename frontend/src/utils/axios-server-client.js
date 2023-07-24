import axios from 'axios'

import { getBackendUrl } from './get-backend-url'

export const createAxiosServerClient = token => {
  const client = axios.create({
    baseURL: getBackendUrl(),
    withCredentials: true
  })
  client.defaults.headers.common.Authorization = `Bearer ${token}`
  return client
}
