import { Divider, Text, Title } from '@mantine/core'

import { Layout } from '../components/layout'
import { RegisterForm } from '../features/auth'

const RegisterPage = () => {
  return (
    <Layout title='Register'>
      <div className='mx-auto max-w-2xl gap-4 rounded bg-gray-600 p-4'>
        <Title>Create a new account</Title>
        <Text color='dimmed'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ipsam
          exercitationem voluptatibus minima ratione ea minus totam ab quibusdam
          impedit itaque!
        </Text>
        <Divider my='sm' />
        <RegisterForm />
      </div>
    </Layout>
  )
}

export default RegisterPage
