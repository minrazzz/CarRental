import { TextInput } from '@mantine/core'
import { BsSearch } from 'react-icons/bs'

export const SearchCars = ({ cars, onSearch }) => {
  const handleChange = event => {
    const filteredCars = cars.filter(car =>
      car.name.toLowerCase().includes(event.target.value.toLowerCase())
    )
    onSearch(filteredCars)
  }
  return (
    <TextInput
      icon={<BsSearch />}
      placeholder='Search cars'
      onChange={handleChange}
      className='w-full lg:w-[25rem]'
    />
  )
}
