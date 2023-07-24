import { Button, Select, TextInput } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'

import { useDeleteUser } from '../../../hooks/use-delete-user'
import { useUpdateUser } from '../../../hooks/use-update-user'

export const UpdateUserForm = ({ user }) => {
  const modals = useModals()
  const { showNotification } = useNotifications()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const { getFieldProps, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      role: user?.role ?? ''
    },
    onSubmit: async values => {
      try {
        const updateUserPayload = { userId: user._id, ...values }
        const message = await updateUser.mutateAsync(updateUserPayload)
        showNotification({ title: 'User Updated', message })
        modals.closeAll()
      } catch (error) {
        showNotification({
          title: 'Failed to update user',
          message: error.message,
          type: 'error'
        })
      }
    }
  })

  const openDeleteUserModal = () =>
    modals.openConfirmModal({
      title: `Are you sure you want to delete user ${user.firstName} ${user.lastName} ?`,
      labels: { cancel: 'Cancel', confirm: 'Confirm' },
      onConfirm: handleDeleteUser
    })
  const handleDeleteUser = async () => {
    try {
      const message = await deleteUser.mutateAsync(user._id)
      showNotification({ title: 'User Deleted', message })
    } catch (error) {
      showNotification({
        title: 'Failed to delete user',
        message: error.message,
        type: 'error'
      })
    }
  }
  return (
    <form className='mb-2 space-y-2' onSubmit={handleSubmit}>
      <div className='grid gap-4 lg:grid-cols-2'>
        <TextInput label='First Name' {...getFieldProps('firstName')} />
        <TextInput label='Last Name' {...getFieldProps('lastName')} />
        <TextInput label='Email' {...getFieldProps('email')} />
        <TextInput label='Phone Number' {...getFieldProps('phoneNumber')} />
        <Select
          label='Role'
          data={[
            { label: 'User', value: 'user' },
            { label: 'Admin', value: 'admin' }
          ]}
          defaultValue={values.role}
          onChange={value => setFieldValue(value)}
        />
      </div>
      <div className='space-x-2'>
        <Button type='submit'>Confirm Update</Button>
        <Button color='red' variant='outline' onClick={openDeleteUserModal}>
          Delete User
        </Button>
      </div>
    </form>
  )
}
