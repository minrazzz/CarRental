import { UpdateUserForm } from './update-user-form'

export const UserItem = ({ user }) => {
  return (
    <div className='rounded-md bg-gray-600 p-4 lg:max-w-2xl'>
      <UpdateUserForm user={user} />
    </div>
  )
}
