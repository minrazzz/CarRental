import { Alert } from '@mantine/core'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { findAllCars, getCarById } from '../../api/car'
import { Layout } from '../../components/layout'
import { CarDetail } from '../../features/car'
import { axiosClient } from '../../utils/axios-client'

const CarDetailPage = ({ car }) => {
  const router = useRouter()
  const carId = router.query.id
  const { data } = useQuery(['cars', carId], () => getCarById(carId), {
    initialData: car
  })
  if (!data) return <Alert>Car with that id doesnt&apos;t exist</Alert>
  return (
    <Layout title={data.name}>
      <CarDetail car={data} />
    </Layout>
  )
}
export const getStaticProps = async ctx => {
  const carId = ctx.params.id
  const { data: car } = await axiosClient.get(`/cars/${carId}`)
  return { props: { car }, revalidate: 60 }
}
export const getStaticPaths = async () => {
  const cars = await findAllCars()
  const paths = cars.map(car => ({ params: { id: car._id } }))
  return { paths, fallback: false }
}
export default CarDetailPage
