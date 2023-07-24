import { Button } from '@mantine/core'
import { useModals } from '@mantine/modals'

import { AddCarForm } from './add-car-form'
import { CarItem } from './car-item'

export const CarList = ({ cars }) => {
  const modals = useModals()

  const openAddCarModal = () =>
    modals.openModal({
      title: 'Add a new car',
      children: <AddCarForm />
    })
  return (
    <div className='space-y-2'>
      <Button onClick={openAddCarModal}>Add new Car</Button>
      <div>
        {cars.map(car => (
          <CarItem key={car._id} car={car} />
        ))}
      </div>
    </div>
  )
}
