export const FRONTEND_URL = 'http://localhost:3000'
process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL
  : 'http://localhost:3000'
