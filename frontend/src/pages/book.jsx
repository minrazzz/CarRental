import { Alert, Text, Title } from '@mantine/core'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { Layout } from '../components/layout'
import { Map } from '../components/map'
import { PrivateRoute } from '../components/private-route'
import { BookingForm } from '../features/booking'
import { useUser } from '../hooks/use-user'
import { axiosClient } from '../utils/axios-client'

const BookingPage = ({ car }) => {
  const router = useRouter()
  const { data: user } = useUser()
  const [pickupLocation, setPickupLocation] = useState()
  const [dropOffLocation, setDropOffLocation] = useState()

  useEffect(() => {
    if (user && user.role === 'admin') {
      router.push('/')
    }
  }, [router, user])
  return (
    <Layout title='Book'>
      <PrivateRoute next={`book?carId=${car._id}`}>
        <div className='relative mb-4 h-[500px] w-full'>
          <Map
            onPickupLocationClick={setPickupLocation}
            onDropoffLocationClick={setDropOffLocation}
          />
        </div>
        {pickupLocation && dropOffLocation ? (
          <div className='flex max-w-fit flex-col items-start gap-4 lg:flex-row lg:gap-12'>
            <BookingForm
              car={car}
              pickupLocation={pickupLocation}
              dropoffLocation={dropOffLocation}
            />
            <div className='space-y-2 p-2'>
              <Image
                src={car.image}
                width={600}
                height={300}
                alt={car.name}
                objectFit='cover'
                className='rounded-2xl'
              />
              <Title>{car.name}</Title>
              <Text className='max-w-md'>{car.description}</Text>
            </div>
          </div>
        ) : (
          <Alert>
            Please specify pickup and dropoff location before proceeding to book
          </Alert>
        )}
      </PrivateRoute>
    </Layout>
  )
}
export const getServerSideProps = async ctx => {
  const { data: car } = await axiosClient.get(`/cars/${ctx.query.carId}`)
  return { props: { car } }
}
export default BookingPage
