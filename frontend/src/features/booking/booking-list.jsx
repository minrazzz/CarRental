import { BookingItem } from './booking-item'

export const BookingList = ({ bookings }) => {
  return (
    <div className='space-y-4'>
      {bookings.map(booking => (
        <BookingItem key={booking._id} booking={booking} />
      ))}
    </div>
  )
}
