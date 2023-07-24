import { Router } from 'express'

import {
  addCar,
  deleteCar,
  findAll,
  findOneById,
  updateCar
} from '../controllers/car.controller'
import { adminOnly } from '../middlewares/admin-only'
import { authenticated } from '../middlewares/authenticated'

const carRouter = Router()

carRouter.get('/', findAll)
carRouter.get('/:id', findOneById)

//routes accessible to only authenticated users
carRouter.use(authenticated, adminOnly)

carRouter.post('/', addCar)
carRouter.patch('/:id', updateCar)
carRouter.delete('/:id', deleteCar)

export { carRouter }
