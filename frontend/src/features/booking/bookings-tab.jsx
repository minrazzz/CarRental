import { Alert, Tabs } from '@mantine/core'
import React, { useMemo } from 'react'

import { BookingList } from './booking-list'

const BookingsTab = ({ bookings }) => {
  const cancelledBookings = useMemo(
    () => bookings.filter(booking => booking.status === 'cancelled'),
    [bookings]
  )
  const activeBookings = useMemo(
    () => bookings.filter(booking => booking.status === 'booked'),
    [bookings]
  )
  return (
    <Tabs variant='pills'>
      <Tabs.Tab label='All'>
        {bookings.length === 0 ? (
          <Alert>You dont have any bookings right now</Alert>
        ) : (
          <BookingList bookings={bookings} />
        )}
      </Tabs.Tab>
      <Tabs.Tab label='Active'>
        {activeBookings.length === 0 ? (
          <Alert>You dont have any active bookings right now</Alert>
        ) : (
          <BookingList bookings={activeBookings} />
        )}
      </Tabs.Tab>
      <Tabs.Tab label='Cancelled'>
        {cancelledBookings.length === 0 ? (
          <Alert>You dont have any cancelled bookings right now</Alert>
        ) : (
          <BookingList bookings={cancelledBookings} />
        )}
      </Tabs.Tab>
    </Tabs>
  )
}

export default BookingsTab
