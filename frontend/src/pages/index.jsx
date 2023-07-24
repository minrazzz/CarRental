import { parseCookies } from 'nookies'
import { useState } from 'react'
import { dehydrate, QueryClient } from 'react-query'

import { findAllCars } from '../api/car'
import { fetchUser } from '../api/user'
import { Layout } from '../components/layout'
import { CarList } from '../features/car'
import { SearchCars } from '../features/car/search-cars'
import { SortCars } from '../features/car/sort-cars'
import { useCars } from '../hooks/use-cars'

const Home = () => {
  const { data: cars } = useCars()
  const [filteredCars, setFilteredCars] = useState(cars)

  return (
    <Layout title='Home'>
      <div className='mb-4 flex flex-col items-start justify-between gap-2 lg:flex-row lg:gap-0'>
        <SortCars cars={cars} onSort={cars => setFilteredCars([...cars])} />
        <SearchCars cars={cars} onSearch={cars => setFilteredCars([...cars])} />
      </div>
      <CarList cars={filteredCars.length > 0 ? filteredCars : cars} />
    </Layout>
  )
}

export const getServerSideProps = async context => {
  const { token } = parseCookies(context)
  const queryClient = new QueryClient()
  if (token) {
    await queryClient.prefetchQuery('user', () => fetchUser(token))
  }
  await queryClient.prefetchQuery('cars', findAllCars)
  return {
    props: { dehydratedState: dehydrate(queryClient) }
  }
}
export default Home
