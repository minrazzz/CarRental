import { Loader, Tabs } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AiFillCar } from 'react-icons/ai'
import { CgProfile } from 'react-icons/cg'

import { Layout } from '../components/layout'
import { PrivateRoute } from '../components/private-route'
import BookingsTab from '../features/booking/bookings-tab'
import { UpdateUserForm } from '../features/user'
import { useBookings } from '../hooks/use-bookings'
import { useUser } from '../hooks/use-user'

const ProfilePage = () => {
  const { showNotification } = useNotifications()
  const router = useRouter()
  const { data: bookings } = useBookings()
  const { data: user } = useUser()
  useEffect(() => {
    const isSuccess = router.query.success
    if (isSuccess) {
      showNotification({
        title: 'Success',
        message: `Successfully booked ${router.query.carName}`
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.carName, router.query.success])
  return (
    <Layout title='Profile'>
      <PrivateRoute next='/profile'>
        <Tabs>
          <Tabs.Tab icon={<CgProfile />} label='Profile'>
            {user ? <UpdateUserForm user={user} /> : <Loader />}
          </Tabs.Tab>
          {user && user.role === 'user' ? (
            <Tabs.Tab label='Bookings' icon={<AiFillCar />}>
              <BookingsTab bookings={bookings} />
            </Tabs.Tab>
          ) : null}
        </Tabs>
      </PrivateRoute>
    </Layout>
  )
}

export default ProfilePage
