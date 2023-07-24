import { StatusCodes } from 'http-status-codes'

// Restricts access to certain routes to admin users only
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .send({ message: 'You are not authorized to make this request' })
  }
  next()
}
