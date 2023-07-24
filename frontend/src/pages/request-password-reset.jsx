import React from 'react'

import { Layout } from '../components/layout'
import { RequestPasswordResetForm } from '../features/user'

const ForgotPassword = () => {
  return (
    <Layout title='Forgot your password ?'>
      <RequestPasswordResetForm />
    </Layout>
  )
}

export default ForgotPassword
