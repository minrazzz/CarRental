import {
  randNumber,
  randTextRange,
  randVehicle,
  randVehicleModel
} from '@ngneat/falso'

export const CAR_LIST = Array.from({ length: 19 })
  .map((_, index) => index)
  .map(index => ({
    name: randVehicle(),
    image: `https://generatorfun.com/code/uploads/Random-Vehicle-image-${
      index + 1
    }.jpg`,
    description: randTextRange({ min: 200, max: 300 }),
    model: randVehicleModel(),
    numberOfSeats: randNumber({ min: 2, max: 6 }),
    price: randNumber({ min: 2000, max: 3000 })
  }))
