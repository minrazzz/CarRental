import { Table } from '@mantine/core'

import { useTransactions } from '../../../hooks/use-transactions'

export const Transactions = () => {
  const { data: transactions = [] } = useTransactions()

  const rows = transactions.map(transaction => (
    <tr key={transaction.id}>
      <td>{transaction._id}</td>
      <td>{transaction.currency}</td>
      <td>{transaction.customer_email}</td>
      <td>{transaction.amount_total / 100}</td>
      <td>{transaction.payment_status}</td>
    </tr>
  ))
  return (
    <Table striped>
      <thead>
        <tr>
          <th>ID</th>
          <th>Currency</th>
          <th>Customer Email</th>
          <th>Amount Total ( $ )</th>
          <th>Payment Status</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
