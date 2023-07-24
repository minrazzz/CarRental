//@ts-check
import * as Yup from 'yup'

export const addCarSchema = Yup.object().shape({
  name: Yup.string()
    .required('Name is required')
    .min(4, 'Name must be at least 4 characters'),
  description: Yup.string()
    .required()
    .min(20, 'Description must be at least 20 characters'),
  price: Yup.number().required().min(1000),
  model: Yup.string().required(),
  numberOfSeats: Yup.number().required().min(1),
  image: Yup.string().required().url('Invalid image url')
})
