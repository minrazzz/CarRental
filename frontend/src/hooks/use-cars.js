import { useQuery } from 'react-query'

import { findAllCars } from '../api/car'

export const useCars = initialData => {
  return useQuery('cars', findAllCars, {
    initialData
  })
}
