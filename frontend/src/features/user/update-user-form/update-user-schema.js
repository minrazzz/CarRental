import * as Yup from 'yup'

import { PHONE_REGEX } from '../../../constants'

export const updateUserSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required').min(4),
  lastName: Yup.string().required('Last name is required').min(4),
  email: Yup.string().required('Email is required').email(),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(PHONE_REGEX, { message: 'Phone number is invalid' })
})
