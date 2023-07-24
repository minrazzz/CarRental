import { Button, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'

import { useDeleteCar } from '../../../hooks/use-delete-car'
import { useUpdateCar } from '../../../hooks/use-update-car'

export const UpdateCarForm = ({ car }) => {
  const deleteCar = useDeleteCar()
  const updateCar = useUpdateCar()
  const modals = useModals()
  const { showNotification } = useNotifications()

  const { getFieldProps, values, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      name: car?.name ?? '',
      description: car?.description ?? '',
      model: car?.model ?? '',
      numOfSeats: car?.numOfSeats ?? 1,
      price: car?.price ?? 0,
      image: car?.image ?? ''
    },
    onSubmit: async values => {
      try {
        console.log(values)
        const message = await updateCar.mutateAsync({ carId: car._id, ...values })
        showNotification({ message })
      } catch (error) {
        showNotification({ message: error.message, color: 'red' })
      }
    }
  })
  const openDeleteCarModal = () =>
    modals.openConfirmModal({
      title: 'Delete Car',
      children: <p>Are you sure you want to delete this car?</p>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: handleDeleteCar
    })
  const handleDeleteCar = async () => {
    try {
      const message = await deleteCar.mutateAsync(car._id)
      showNotification({ message })
    } catch (error) {
      showNotification({ message: error.message, color: 'red' })
    }
  }
  return (
    <form className='flex-1' onSubmit={handleSubmit}>
      <div className='grid gap-4 lg:grid-cols-2'>
        <TextInput label='Name' {...getFieldProps('name')} />
        <TextInput label='Model' {...getFieldProps('model')} />
        <NumberInput
          min={1}
          label='Number of seats'
          defaultValue={values.numOfSeats}
          onChange={value => setFieldValue('numberOfSeats', value)}
        />
        <TextInput
          min={1000}
          label='Price'
          defaultValue={values.price}
          onChange={value => setFieldValue('price', value)}
        />
        <TextInput label='Image' {...getFieldProps('image')} />
        <Textarea
          minRows={5}
          label='Description'
          className='col-span-full'
          {...getFieldProps('description')}
        />
      </div>
      <div className='mt-2 space-x-2'>
        <Button type='submit' loading={updateCar.isLoading}>
          Confirm Update
        </Button>
        <Button color='red' variant='outline' onClick={openDeleteCarModal}>
          Delete Car
        </Button>
      </div>
    </form>
  )
}
