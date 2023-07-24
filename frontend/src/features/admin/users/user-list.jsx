import { UserItem } from './user-item'

export const UserList = ({ users }) => {
  return (
    <div className='space-y-4'>
      {users.map(user => (
        <UserItem key={user._id} user={user} />
      ))}
    </div>
  )
}
