export const getBackendUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_BACKEND_URL
    : 'http://localhost:4000/api'
}
