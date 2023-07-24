import asyncHandler from 'express-async-handler'
import createError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { CarModel } from '../models/car.model'

export const addCar = asyncHandler(async (req, res) => {
  const car = await CarModel.create(req.body)
  res.status(StatusCodes.CREATED).json(car)
})
export const findAll = asyncHandler(async (req, res, next) => {
  const cars = await CarModel.find()
  res.json(cars)
})
export const findOneById = asyncHandler(async (req, res, next) => {
  const car = await CarModel.findById(req.params.id)
  res.json(car)
})
export const updateCar = asyncHandler(async (req, res, next) => {
  // doing this instead of regular findByIdAndUpdate so we can excute the middleware to convert longurl to shortened url
  const { name, model, numberOfSeats, price, image, description } = req.body
  const car = await CarModel.findByIdAndUpdate(req.params.id)
  if (!car) return next(createError(StatusCodes.NOT_FOUND, 'Car not found'))
  if (name) car.name = name
  if (model) car.model = model
  if (numberOfSeats) car.numberOfSeats = numberOfSeats
  if (price) car.price = price
  if (image) car.image = image
  if (description) car.description = description

  await car.save()

  res.status(StatusCodes.OK).send('Car information updated successfully')
})
export const deleteCar = asyncHandler(async (req, res, next) => {
  await CarModel.findByIdAndDelete(req.params.id)
  res.status(StatusCodes.OK).send('Car deleted successfully')
})
