import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'

import { registerSchema } from './register-schema'
import { useRegister } from './use-register'

export const RegisterForm = () => {
  const register = useRegister()
  const router = useRouter()

  const { showNotification } = useNotifications()
  const {
    getFieldProps,
    errors,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldError
  } = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: ''
    },
    onSubmit: async values => {
      // check for confirm password only on frontend
      const { _, ...rest } = values

      try {
        if (!isNaN(parseInt(rest.firstName))) {
          return setFieldError('firstName', 'Number is not valid!')
        }
        if (!isNaN(parseInt(rest.lastName))) {
          return setFieldError('firstName', 'Number is not valid!')
        }

        await register.mutateAsync(rest, {
          onSuccess: () => {
            showNotification({ message: 'Registration successful' })
            router.push('/')
          }
        })
      } catch (error) {
        showNotification({
          title: 'Signup Failed',
          message: error.message,
          color: 'red'
        })
      }
    },
    validationSchema: registerSchema
  })
  const getFieldError = fieldName =>
    errors[fieldName] && touched[fieldName] ? errors[fieldName] : undefined
  return (
    <form onSubmit={handleSubmit} className='grid gap-4 lg:grid-cols-2'>
      <TextInput
        label='First Name'
        {...getFieldProps('firstName')}
        error={getFieldError('firstName')}
        placeholder='John'
      />
      <TextInput
        label='Last Name'
        {...getFieldProps('lastName')}
        error={getFieldError('lastName')}
        placeholder='Doe'
      />
      <TextInput
        label='Email'
        {...getFieldProps('email')}
        error={getFieldError('email')}
        placeholder='johndoe@gmail.com'
      />
      <TextInput
        label='Phone Number'
        {...getFieldProps('phoneNumber')}
        error={getFieldError('phoneNumber')}
        placeholder='98474*****'
      />
      <PasswordInput
        label='Password'
        {...getFieldProps('password')}
        error={getFieldError('password')}
        placeholder='********'
      />
      <PasswordInput
        label='Confirm Password'
        {...getFieldProps('confirmPassword')}
        error={getFieldError('confirmPassword')}
        placeholder='********'
      />
      <Button type='submit' fullWidth loading={isSubmitting}>
        Confirm Registration
      </Button>
    </form>
  )
}
