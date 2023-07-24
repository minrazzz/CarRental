import { Router } from 'express'

import { findAll } from '../controllers/transaction.controller'
import { adminOnly } from '../middlewares/admin-only'
import { authenticated } from '../middlewares/authenticated'

const transactionRouter = Router()

transactionRouter.use(authenticated, adminOnly)

transactionRouter.get('/', findAll)

export default transactionRouter
