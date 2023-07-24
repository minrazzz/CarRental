import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'
import Image from 'next/image'

import { UpdateCarForm } from './update-car-form'

dayjs.extend(LocalizedFormat)

export const CarItem = ({ car }) => {
  return (
    <div className='mb-4 rounded-md bg-gray-600 p-2'>
      <div className='mb-2 flex flex-col justify-between gap-2 lg:flex-row lg:gap-6'>
        <Image
          src={car.image}
          width={400}
          height={300}
          alt={car.name}
          objectFit='cover'
          className='rounded-md'
        />
        <UpdateCarForm car={car} />
      </div>
    </div>
  )
}
