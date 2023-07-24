import { Button, Text, TextInput, Title } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import { MdEmail } from 'react-icons/md'
import { useMutation } from 'react-query'
import * as Yup from 'yup'

import { axiosClient } from '../../utils/axios-client'

export const RequestPasswordResetForm = () => {
  const { showNotification } = useNotifications()

  const requestPasswordReset = useMutation(async email => {
    try {
      const { data } = await axiosClient.post('/users/request-password-reset', {
        email
      })
      showNotification({
        title: 'Password reset',
        message: data.message
      })
    } catch (error) {
      showNotification({
        title: 'Error',
        message: error.response?.data?.message ?? 'An error occurred'
      })
    }
  })
  const { getFieldProps, errors, touched, handleSubmit } = useFormik({
    initialValues: {
      email: ''
    },
    onSubmit: async values => {
      await requestPasswordReset.mutateAsync(values.email)
    },
    validationSchema
  })
  return (
    <div className='mx-auto max-w-sm rounded-md bg-gray-600 p-4 shadow-md'>
      <Title order={3}>Reset your password</Title>
      <Text mt='xs' mb='md'>
        Request password reset link on your email
      </Text>
      <form onSubmit={handleSubmit}>
        <TextInput
          icon={<MdEmail />}
          placeholder='Email Address'
          {...getFieldProps('email')}
          error={errors.email && touched.email ? errors.email : undefined}
        />
        <Button
          type='submit'
          mt='xs'
          fullWidth
          loading={requestPasswordReset.isLoading}
        >
          Send link
        </Button>
      </form>
    </div>
  )
}
const validationSchema = Yup.object().shape({
  email: Yup.string().required().email()
})
