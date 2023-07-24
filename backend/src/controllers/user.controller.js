import asyncHandler from 'express-async-handler'
import createError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { UserModel } from '../models/user.model'

export const profile = asyncHandler(async (req, res, next) => {
  return res.json(req.user)
})
export const updateProfile = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber } = req.body

  const user = await UserModel.findById(req.user._id)
  if (!user) return next(createError(StatusCodes.UNAUTHORIZED, 'User not found'))

  // only update the fields when the provided fields aren't same as the current user's fields
  if (firstName && firstName !== user.firstName) user.firstName = firstName
  if (lastName && lastName !== user.lastName) user.lastName = lastName
  if (email && email !== user.email) user.email = email
  if (phoneNumber && phoneNumber !== user.phoneNumber) user.phoneNumber = phoneNumber

  await user.save()
  return res.json(user)
})

export const findAll = asyncHandler(async (req, res, next) => {
  const users = await UserModel.find()
  res.json(users)
})
export const deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  await UserModel.findByIdAndDelete(id)
  res.status(StatusCodes.OK).send(`User with id ${id} deleted`)
})
export const updateUser = asyncHandler(async (req, res, next) => {
  await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(StatusCodes.OK).send(`User with id ${req.params.id} updated`)
})
