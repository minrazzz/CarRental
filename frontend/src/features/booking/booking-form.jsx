import { Button, Divider, Text } from '@mantine/core'
import { DateRangePicker } from '@mantine/dates'
import { useNotifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { MdPayment } from 'react-icons/md'

import { useCheckout } from '../../hooks/use-checkout'

export const BookingForm = ({ pickupLocation, dropoffLocation, car }) => {
  const checkout = useCheckout()
  const { showNotification } = useNotifications()
  const [bookingDuration, setBookingDuration] = useState()

  //calculate the total number of days between pickup and dropoff
  const calculateTotalBookingDays = useCallback(() => {
    if (!bookingDuration) return
    const [start, end] = bookingDuration
    return dayjs(end).diff(start, 'day')
  }, [bookingDuration])

  const handleSubmit = async event => {
    event.preventDefault()
    const newBooking = {
      pickupLocation,
      dropoffLocation,
      startDate: bookingDuration[0],
      endDate: bookingDuration[1]
    }
    try {
      await checkout.mutateAsync({ ...newBooking, carId: car._id })
    } catch (error) {
      showNotification({ message: error.message, color: 'red' })
    }
  }
  return (
    <form className='min-w-full space-y-2 lg:min-w-[30rem]' onSubmit={handleSubmit}>
      <DateRangePicker
        label='Book Car'
        placeholder='Pick pickup and dropoff dates'
        value={bookingDuration}
        onChange={setBookingDuration}
        minDate={new Date()}
      />
      {/* Only show information about booking only when there is booking duration selected and none of the value 
         inside the booking duration array is null
      */}
      {bookingDuration && !bookingDuration.some(duration => !duration) && (
        <>
          <div className='rounded bg-gray-600 p-2 font-medium '>
            <Text>Total Booking Days : {calculateTotalBookingDays()}</Text>
            <Text>Booking Price per day: {`Rs${car.price}`}</Text>
            <Divider my='xs' />
            <Text>
              Total Booking Price : {`Rs${car.price * calculateTotalBookingDays()}`}
            </Text>
          </div>
          <Button
            loading={checkout.isLoading}
            type='submit'
            leftIcon={<MdPayment />}
          >
            Proceed to payment
          </Button>
        </>
      )}
    </form>
  )
}
