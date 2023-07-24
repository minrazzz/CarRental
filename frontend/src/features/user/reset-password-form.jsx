import { Button, PasswordInput } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import * as Yup from 'yup'

import { PASSWORD_REGEX } from '../../constants'
import { axiosClient } from '../../utils/axios-client'

export const ResetPasswordForm = () => {
  const router = useRouter()
  const { showNotification } = useNotifications()
  const resetPassword = useMutation(async resetPasswordPayload => {
    try {
      const { data } = await axiosClient.post(
        `/users/reset-password/${router.query.token}`,
        resetPasswordPayload
      )
      showNotification({
        title: 'Password reset',
        message: data.message
      })
      router.push('/login')
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.message ?? 'An error occurred',
        color: 'red'
      })
    }
  })
  const { getFieldProps, handleSubmit, errors, touched } = useFormik({
    initialValues: {
      password: '',
      confirmPassword: ''
    },
    validationSchema,
    onSubmit: async values => {
      await resetPassword.mutateAsync({ password: values.password })
    }
  })
  return (
    <form
      onSubmit={handleSubmit}
      className='mx-auto max-w-sm space-y-2 rounded-md bg-gray-600 p-4 shadow-md'
    >
      <PasswordInput
        label='New password'
        error={errors.password && touched.password ? errors.password : undefined}
        {...getFieldProps('password')}
        placeholder='********'
      />
      <PasswordInput
        label='Confirm new password'
        error={
          errors.confirmPassword && touched.confirmPassword
            ? errors.confirmPassword
            : undefined
        }
        {...getFieldProps('confirmPassword')}
        placeholder='********'
      />
      <Button fullWidth type='submit' loading={resetPassword.isLoading}>
        Confirm Password Reset
      </Button>
    </form>
  )
}
const validationSchema = Yup.object().shape({
  password: Yup.string().required('Password is required').matches(PASSWORD_REGEX, {
    message:
      'Password must be at least 8 characters long and contain at least one number, one uppercase letter and one lowercase letter'
  }),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
})
