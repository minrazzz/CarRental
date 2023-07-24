import asyncHandler from 'express-async-handler'

import { TransactionModel } from '../models/transaction.model'

export const findAll = asyncHandler(async (req, res, next) => {
  const transactions = await TransactionModel.find()
  res.json(transactions)
})
