import { useQuery } from 'react-query'

import { axiosClient } from '../utils/axios-client'

export const useTransactions = () => {
  return useQuery('transactions', async () => {
    try {
      const { data: transactions } = await axiosClient.get('/transactions')
      return transactions
    } catch (error) {
      throw new Error(
        error.response?.data?.message ?? 'Failed to retrieve transactions'
      )
    }
  })
}
