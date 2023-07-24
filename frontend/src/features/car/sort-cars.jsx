import { Select } from '@mantine/core'
import React from 'react'
import { MdSort } from 'react-icons/md'

export const SortCars = ({ cars, onSort }) => {
  const handleChange = value => {
    if (value === 'price-low-to-high') {
      const sortedCars = cars.sort((a, b) => a.price - b.price)
      onSort(sortedCars)
    }
    if (value === 'price-high-to-low') {
      const sortedCars = cars.sort((a, b) => b.price - a.price)
      onSort(sortedCars)
    }
  }
  return (
    <Select
      icon={<MdSort />}
      data={data}
      placeholder='Sort cars'
      onChange={handleChange}
      className='w-48 lg:min-w-fit'
    />
  )
}
const data = [
  {
    label: 'Price Low to High',
    value: 'price-low-to-high'
  },
  {
    label: 'Price High to Low',
    value: 'price-high-to-low'
  }
]
