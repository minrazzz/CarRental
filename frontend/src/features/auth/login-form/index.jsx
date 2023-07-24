import { Button, PasswordInput, TextInput } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { FaUserAlt } from 'react-icons/fa'
import { MdPassword } from 'react-icons/md'

import { loginSchema } from './login-schema'
import { useLogin } from './use-login'

export const LoginForm = () => {
  const login = useLogin()
  const router = useRouter()

  const { showNotification } = useNotifications()
  const { handleSubmit, getFieldProps, errors, touched, isSubmitting } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: async values => {
      try {
        await login.mutateAsync(values)
        showNotification({ message: 'Login successful' })
        router.push(router.query.next ?? '/')
      } catch (error) {
        showNotification({
          title: 'Login Failed',
          message: error.message,
          color: 'red'
        })
      }
    },
    validationSchema: loginSchema
  })
  const getFieldError = fieldName =>
    errors[fieldName] && touched[fieldName] ? errors[fieldName] : undefined
  return (
    <form onSubmit={handleSubmit} className='space-y-2'>
      <TextInput
        icon={<FaUserAlt />}
        label='Email Address'
        placeholder='johndoe@gmail.com'
        error={getFieldError('email')}
        {...getFieldProps('email')}
      />
      <PasswordInput
        icon={<MdPassword />}
        error={getFieldError('password')}
        label='Password'
        placeholder='********'
        {...getFieldProps('password')}
      />
      <Button type='submit' fullWidth loading={isSubmitting}>
        Login
      </Button>
    </form>
  )
}
