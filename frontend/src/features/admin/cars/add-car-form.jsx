import { Button, NumberInput, Textarea, TextInput } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'

import { useAddCar } from '../../../hooks/use-add-car'
import { addCarSchema } from './add-car-schema'

export const AddCarForm = () => {
  const modals = useModals()
  const addCar = useAddCar() 
  const { showNotification } = useNotifications()
  const { getFieldProps, setFieldValue, values, errors, touched, handleSubmit } =
    useFormik({
      initialValues: {
        name: '',
        description: '',
        price: 0,
        model: '',
        numberOfSeats: 1,
        image: ''
      },
      onSubmit: async values => {
        try {
          await addCar.mutateAsync(values)
          showNotification({ message: 'Car added successfully' })
          modals.closeAll()
          console.log(values)
        } catch (error) {
          showNotification({ message: error.message, color: 'red' })
        }
      },
      validationSchema: addCarSchema
    })
  const getFieldError = fieldName =>
    errors[fieldName] && touched[fieldName] ? errors[fieldName] : ''

  return (
    <form className='space-y-2' onSubmit={handleSubmit}>
      <TextInput
        label='Name'
        error={getFieldError('name')}
        {...getFieldProps('name')}
      />
      <Textarea
        error={getFieldError('description')}
        label='Description'
        {...getFieldProps('description')}
      />
      <TextInput
        error={getFieldError('model')}
        label='Model'
        {...getFieldProps('model')}
      />
      <NumberInput
        error={getFieldError('numberOfSeats')}
        min={1}
        label='Number of seats'
        defaultValue={values.numberOfSeats}
        onChange={value => setFieldValue('numberOfSeats', value)}
      />
      <TextInput
        label='Image'
        {...getFieldProps('image')}
        error={getFieldError('image')}
      />
      <NumberInput
        error={getFieldError('price')}
        min={1000}
        label='Price'
        defaultValue={values.price}
        onChange={value => setFieldValue('price', value)}
      />
      <Button type='submit'>Add Car</Button>
    </form>
  )
}
