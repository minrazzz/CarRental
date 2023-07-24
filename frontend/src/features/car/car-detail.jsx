import { Alert, Button, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useUser } from '../../hooks/use-user'
import { isCarBooked } from '../../utils/is-car-booked'

dayjs.extend(LocalizedFormat)

export const CarDetail = ({ car }) => {
  const { data: user } = useUser()
  const { data } = useUser()
  const router = useRouter()

  const handleBookingClick = () => {
    if (!data) {
      return router.push({
        pathname: '/login',
        query: { next: `/book?carId=${car._id}` }
      })
    }
    return router.push(`/book?carId=${car._id}`)
  }
  return (
    <div className='flex flex-col gap-2 lg:flex-row lg:gap-6'>
      <Image
        src={car.image}
        width={600}
        height={400}
        objectFit='cover'
        alt={car.name}
        className='rounded-md'
      />
      <div className='max-w-lg space-y-4'>
        <Title>{car.name}</Title>
        <Text color='dimmed'>{car.description}</Text>
        <div className='space-y-2 rounded bg-gray-600 p-2 font-medium'>
          <Text>Model : {car.model}</Text>
          <Text>Num of seats : {car.numberOfSeats}</Text>
          <Text>Renting Price : {`Rs${car.price}/per Day`}</Text>
        </div>
        {isCarBooked(car) ? (
          <Alert color='red' variant='filled'>
            Car is unavailable to book from {`${dayjs(car.bookedFrom).format('LL')}`}{' '}
            to {`${dayjs(car.bookedUntill).format('LL')}`}
          </Alert>
        ) : (
          <Button
            disabled={user && user.role === 'admin'}
            title={user && user.role === 'admin' ? 'Admin can not book' : 'Book Now'}
            onClick={handleBookingClick}
          >
            Book Now
          </Button>
        )}
      </div>
    </div>
  )
}
