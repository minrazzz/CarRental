import React from 'react'

export const RenderObject = ({ object }) => {
  return (
    <div className='mb-4 rounded-md bg-gray-600 p-4'>
      {Object.entries(object).map(([key, value]) => (
        <div key={key}>
          <span className='font-bold capitalize'>{key}</span>
          <span className='mx-2'>:</span>
          <span>{typeof value === 'boolean' ? JSON.stringify(value) : value}</span>
        </div>
      ))}
    </div>
  )
}
