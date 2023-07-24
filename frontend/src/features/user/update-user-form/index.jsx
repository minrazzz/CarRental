import { Button, TextInput } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useQueryClient } from 'react-query'

import { useUpdateUserProfile } from '../../../hooks/use-update-user-profile'
import { autoLogout } from '../../../utils/auth'
import { updateUserSchema } from './update-user-schema'

export const UpdateUserForm = ({ user }) => {
  const updateUser = useUpdateUserProfile()
  const { showNotification } = useNotifications()
  const queryClient = useQueryClient()
  const router = useRouter()
  const modals = useModals()

  const { getFieldProps, handleSubmit, touched, errors, isSubmitting } = useFormik({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? ''
    },
    onSubmit: async values => {
      try {
        await updateUser.mutateAsync(values, {
          onSuccess: () => {
            showNotification({ message: 'Profile information updated' })
          }
        })
      } catch (error) {
        showNotification({ title: 'Error', message: error.message, color: 'red' })
      }
    },
    validationSchema: updateUserSchema
  })
  const getFieldError = fieldName =>
    errors[fieldName] && touched[fieldName] ? errors[fieldName] : undefined

  const openConfirmLogoutModal = () =>
    modals.openConfirmModal({
      title: 'Are you sure you want to logout?',
      children: (
        <div>
          <p>You will be logged out of your account.</p>
          <p>You can log back any time by visiting the login page.</p>
        </div>
      ),
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onConfirm: () => {
        autoLogout()
        router.push('/login')
        queryClient.removeQueries('user')
      },
      onCancel: () => modals.closeAll()
    })
  return (
    <form
      onSubmit={handleSubmit}
      className='grid max-w-2xl gap-4 rounded-md bg-gray-600 p-4 lg:grid-cols-2'
    >
      <TextInput
        label='First Name'
        placeholder='John'
        {...getFieldProps('firstName')}
        error={getFieldError('firstName')}
      />
      <TextInput
        label='Last Name'
        placeholder='Doe'
        {...getFieldProps('lastName')}
        error={getFieldError('lastName')}
      />
      <TextInput
        label='Email Address'
        placeholder='johndoe@gmail.com'
        {...getFieldProps('email')}
        error={getFieldError('email')}
      />
      <TextInput
        label='Phone Number'
        placeholder='9856xxxxxx'
        {...getFieldProps('phoneNumber')}
        error={getFieldError('phoneNumber')}
      />
      <div className='flex gap-2'>
        <Button type='submit' loading={isSubmitting}>
          Update Profile Information
        </Button>
        <Button variant='outline' color='red' onClick={openConfirmLogoutModal}>
          Logout
        </Button>
      </div>
    </form>
  )
}
