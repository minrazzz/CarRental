import { Badge, Button, Text, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Image from 'next/image'
import ReactMapGL, { Popup } from 'react-map-gl'

import { useCancelBooking } from './use-cancel-booking'

dayjs.extend(localizedFormat)

export const BookingItem = ({ booking }) => {
  const modals = useModals()
  const { showNotification } = useNotifications()

  const cancelBooking = useCancelBooking()
  // const { lng: pickupLng, lat: pickupLat } = booking.pickupLocation
  // const { lng: dropoffLng, lat: dropoffLat } = booking.dropoffLocation

  const handleCancel = async () => {
    try {
      const message = await cancelBooking.mutateAsync({
        bookingId: booking._id,
        carId: booking.car._id
      })
      showNotification({ message })
    } catch (error) {
      showNotification({ title: 'Error', message: error.message, color: 'red' })
    }
  }
  const openCancelBookingModel = () =>
    modals.openConfirmModal({
      title: 'Cancel Booking',
      children: <Text>Are you sure you want to cancel this booking?</Text>,
      labels: { cancel: 'Cancel', confirm: 'Confirm' },
      onConfirm: handleCancel
    })
  return (
    <div className='flex flex-col items-start gap-4 rounded bg-gray-600 p-2 shadow lg:flex-row'>
      <div>
        <Image
          src={booking.car.image}
          width={400}
          height={300}
          alt={booking.car.name}
          objectFit='cover'
          className='rounded-md'
        />
        <Title order={2}>{booking.car.name}</Title>
        <Badge my='sm' color={booking.status === 'cancelled' ? 'red' : 'green'}>
          {booking.status}
        </Badge>
        <div className='space-y-2 rounded bg-gray-500 p-2'>
          <Text>Start Date : {dayjs(booking.startDate).format('LL')}</Text>
          <Text>End Date : {dayjs(booking.endDate).format('LL')}</Text>
          <Text>Total Booking Price: {`Rs${booking.totalPrice}`}</Text>
        </div>
        {booking.status !== 'cancelled' && (
          <Button color='red' mt='sm' onClick={openCancelBookingModel}>
            Cancel Booking
          </Button>
        )}
      </div>
      {/* <ReactMapGL
        style={{ height: '400px', borderRadius: '10px', width: '100%' }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle='mapbox://styles/mapbox/streets-v11'
        initialViewState={{
          longitude: pickupLng,
          latitude: pickupLat,
          zoom: 16
        }}
      >
        <Popup longitude={pickupLng} latitude={pickupLat}>
          <Text>Pickup Location</Text>
          <Text>Longitude: {pickupLng.toFixed(2)}</Text>
          <Text>Latitude : {pickupLat.toFixed(2)}</Text>
        </Popup>
        <Popup longitude={dropoffLng} latitude={dropoffLat}>
          <Text>Dropoff Location</Text>
          <Text>Longitude : {dropoffLng.toFixed(2)}</Text>
          <Text>Latitude : {dropoffLat.toFixed(2)}</Text>
        </Popup>
      </ReactMapGL> */}
    </div>
  )
}
