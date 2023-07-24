import { Router } from 'express'

import {
  login,
  requestPasswordReset,
  resetPassword,
  signup
} from '../controllers/auth.controller'
import {
  deleteUser,
  findAll,
  profile,
  updateProfile,
  updateUser
} from '../controllers/user.controller'
import { adminOnly } from '../middlewares/admin-only'
import { authenticated } from '../middlewares/authenticated'

const userRouter = Router()

//public user routes
userRouter.post('/signup', signup)
// /api/users/login
userRouter.post('/login', login)
userRouter.post('/request-password-reset', requestPasswordReset)
userRouter.post('/reset-password/:resetPasswordToken', resetPassword)

// routes accessible to only logged in users
userRouter.use(authenticated)
userRouter.get('/profile', profile)
userRouter.post('/profile', updateProfile)

//routes accessible to only admin
userRouter.use(adminOnly)
userRouter.get('/', findAll)
userRouter.delete('/:id', deleteUser)
userRouter.patch('/:id', updateUser)

export { userRouter }
