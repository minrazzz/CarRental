import * as Yup from 'yup'

import { PASSWORD_REGEX, PHONE_REGEX } from '../../../constants'

export const registerSchema = Yup.object().shape({
  firstName: Yup.string().required().min(4),
  lastName: Yup.string().required().min(4),
  email: Yup.string().required().email(),
  phoneNumber: Yup.string()
    .required()
    .matches(PHONE_REGEX, { message: 'Phone number is not valid' }),
  password: Yup.string()
    .matches(PASSWORD_REGEX, {
      message:
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character'
    })
    .required(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required()
})
