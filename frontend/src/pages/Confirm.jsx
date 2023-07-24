// import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { axiosClient } from '../utils/axios-client'
// import { useLocation } from 'react-router-dom'

const Confirm = () => {
  useEffect(() => {
    setTimeout(() => {
      alert('payment successfull!')
    }, 500)
  }, [])

  const router = useRouter()
  const { query } = router
  const [id, setId] = useState(carId)

  const pidx = query.pidx
  const txnId = query.txnId
  const amount = query.amount
  const mobile = query.mobile
  const purchaseOrderId = query.purchase_order_id
  const purchaseOrderName = query.purchase_order_name
  const transactionId = query.transaction_id
  const carId = query.carId
  console.log(carId)
  // totalAmount: amount,
  //     purchase_order_name: purchaseOrderName,
  //     mobile

  // useEffect(async () => {
  //   const { data } = await axiosClient.post(`/bookings/details`, purchaseOrderId)
  // }, [])

  // const location = useLocation()
  // const searchParams = new URLSearchParams(location.search)

  // console.log(searchParams)

  // Extracting the values using the keys
  // const pidx = searchParams.get('pidx')
  // const txnId = searchParams.get('txnId')
  // const amount = searchParams.get('amount')
  // const mobile = searchParams.get('mobile')
  // const purchaseOrderId = searchParams.get('purchase_order_id')
  // const purchaseOrderName = searchParams.get('purchase_order_name')
  // const transactionId = searchParams.get('transaction_id')

  return (
    <div>
      <div className='confirm-details col mx-auto flex  max-w-screen-lg flex-col items-center justify-center gap-y-4'>
        <p>
          <span className='text-[#9333EA]'>pidx</span>: {pidx}
        </p>
        <p>
          <span className='text-[#9333EA]'>txnId</span>: {txnId}
        </p>
        <p>
          <span className='text-[#9333EA]'>amount</span>: {amount}
        </p>
        <p>
          <span className='text-[#9333EA]'>mobile</span>: {mobile}
        </p>
        <p>
          <span className='text-[#9333EA]'>purchase_order_id</span>:{' '}
          {purchaseOrderId}
        </p>
        <p>
          <span className='text-[#9333EA]'>purchase_order_name</span>:{' '}
          {purchaseOrderName}
        </p>
        <p>
          <span className='text-[#9333EA]'>transaction_id</span>: {transactionId}
        </p>
        <button
          onClick={() => router.push('/')}
          className='rounded-sm bg-[#9333EA] px-2 py-0.5'
        >
          <i className='fa-solid fa-arrow-left'></i>Home
        </button>
      </div>

      {/* <button onClick{()=>router.push("/")}>
        <i className='fa-solid fa-arrow-left'></i>Home
      </button> */}
    </div>
  )
}

export default Confirm
