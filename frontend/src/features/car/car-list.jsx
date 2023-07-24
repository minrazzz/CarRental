import { CarItem } from './car-item'

export const CarList = ({ cars }) => {
  return (
    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cars.map(car => (
        <CarItem key={car._id} car={car} />
      ))}
    </div>
  )
}
