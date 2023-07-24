import { Tabs } from '@mantine/core'

import { CarList } from '../features/admin/cars/car-list'
import { Transactions } from '../features/admin/transactions/transactions'
import { UserList } from '../features/admin/users/user-list'
import { useCars } from '../hooks/use-cars'
import { useUsers } from '../hooks/user-users'

export const AdminTabs = () => {
  const { data: users = [] } = useUsers()
  const { data: cars = [] } = useCars()
  return (
    <Tabs>
      <Tabs.Tab label='Users'>
        <UserList users={users} />
      </Tabs.Tab>
      <Tabs.Tab label='Cars'>
        <CarList cars={cars} />
      </Tabs.Tab>
      <Tabs.Tab label='Transactions'>
        <Transactions />
      </Tabs.Tab>
    </Tabs>
  )
}
