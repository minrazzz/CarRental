import { model, Schema } from 'mongoose'

const transactionSchema = new Schema({
  currency: String,
  customer_email: String,
  amount_total: Number,
  payment_status: String
})
export const TransactionModel = model('Transaction', transactionSchema)
