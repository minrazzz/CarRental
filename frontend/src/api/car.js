import { axiosClient } from '../utils/axios-client'

export const findAllCars = async () => {
  const { data: cars } = await axiosClient.get('/cars')
  return cars
}
export const getCarById = async carId => {
  const { data: car } = await axiosClient.get(`/cars/${carId}`)
  return car
}
