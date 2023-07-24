import asyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { UserModel } from '../models/user.model'
import { jwtService } from '../utils/jwt-service'

export const authenticated = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
    const [, token] = authorizationHeader.split(' ')
    const { id } = jwtService.verifyToken(token)
    const user = await UserModel.findById(id)
    if (!user)
      return next(
        createHttpError(
          StatusCodes.UNAUTHORIZED,
          'User doesn"t exist or has been deleted'
        )
      )
    req.user = user
    return next()
  }
  return res.json({ message: 'Not authenticated' })
})
