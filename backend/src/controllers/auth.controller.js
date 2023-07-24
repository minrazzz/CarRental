import { compare } from 'bcryptjs'
import { randomUUID } from 'crypto'
import asyncHandler from 'express-async-handler'
import createError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { FRONTEND_URL } from '../constants'
import { UserModel } from '../models/user.model'
import { Email } from '../utils/email'
import { jwtService } from '../utils/jwt-service'

export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, role } = req.body
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password,
    role
  })
  const accessToken = jwtService.signToken(user._id)
  res.status(StatusCodes.CREATED).json({ accessToken })
})

export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email }).select('+password')
  if (user && (await user.isValidPassword(password))) {
    return res
      .status(StatusCodes.OK)
      .json({ accessToken: jwtService.signToken(user._id) })
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid email or password' })
})
export const requestPasswordReset = asyncHandler(async (req, res, next) => {
  const { email } = req.body
  const user = await UserModel.findOne({ email })
  if (!user)
    return next(
      createError(StatusCodes.NOT_FOUND, 'User with this email does not exist')
    )
  // check whether the user has already requested a password reset
  if (user.resetPasswordToken)
    return next(
      createError(StatusCodes.BAD_REQUEST, 'Password reset request already sent')
    )
  // generate reset token
  const passwordResetToken = randomUUID()
  user.resetPasswordToken = passwordResetToken
  await user.save({ validateModifiedOnly: true })
  // send reset email
  const emailTransport = new Email(
    user,
    `${FRONTEND_URL}/reset-password?token=${passwordResetToken}`
  )
  await emailTransport.forgotPassword()
  res
    .status(StatusCodes.OK)
    .json({ message: 'Please check your email for password reset link' })
})

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body
  const { resetPasswordToken } = req.params
  const user = await UserModel.findOne({ resetPasswordToken }).select('+password')
  if (!user)
    return next(createError(StatusCodes.NOT_FOUND, 'Invalid password reset token'))
  // check whether the new password is same as the old password
  if (await compare(password, user.password)) {
    return next(
      createError(
        StatusCodes.BAD_REQUEST,
        'New password cannot be same as old password'
      )
    )
  }
  user.password = password
  user.resetPasswordToken = undefined
  await user.save({ validateModifiedOnly: true })
  res.status(StatusCodes.OK).json({ message: 'Password reset successfully' })
})
