import { Badge, Button, Divider, Text, Title } from '@mantine/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { GoPerson } from 'react-icons/go'

import { useUser } from '../../hooks/use-user'
import { isCarBooked } from '../../utils/is-car-booked'

export const CarItem = ({ car }) => {
  const { data: user } = useUser()
  const router = useRouter()
  const handleBookingClick = () => {
    router.push({ pathname: '/book', query: { carId: car._id } })
  }
  const seats = Array.from({ length: car.numberOfSeats })
    .map((_, index) => index)
    .map(seat => (
      <div key={seat} className='rounded-full bg-gray-500 p-1'>
        <GoPerson />
      </div>
    ))

  return (
    <div className='rounded bg-gray-600 p-2'>
      <Image
        src={car.image}
        width={600}
        height={400}
        alt={car.name}
        className='rounded shadow-2xl'
      />
      <Title order={4}>{car.name}</Title>
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex gap-2'>{seats}</div>
        <Badge>{car.model}</Badge>
      </div>
      <Divider my='sm' />
      <div className='flex items-center justify-between gap-2'>
        <Text weight='bold' className='flex-1'>{`Rs${car.price}`}</Text>
        {user && user.role === 'user' ? (
          <Button disabled={isCarBooked(car)} onClick={handleBookingClick}>
            Book Now
          </Button>
        ) : null}
        <Button variant='outline' onClick={() => router.push(`/cars/${car._id}`)}>
          Show More
        </Button>
      </div>
    </div>
  )
}
