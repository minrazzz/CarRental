export const isCarBooked = car =>
  car.isBooked && new Date() < new Date(car.bookedUntill)
