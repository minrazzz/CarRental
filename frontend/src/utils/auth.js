import { setCookie, destroyCookie } from 'nookies'
import { axiosClient } from './axios-client'

export const deleteAuthToken = () => {
  axiosClient.defaults.headers.common.Authorization = ''
  delete axiosClient.defaults.headers.common.Authorization
}

export const setAuthToken = token => {
  deleteAuthToken()
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
export const autoLogin = token => {
  setAuthToken(token)
  setCookie(null, 'token', token)
}
export const autoLogout = () => {
  deleteAuthToken()
  destroyCookie(null, 'token')
}
