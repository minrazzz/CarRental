import { Anchor, Divider, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import Image from 'next/image'
import Link from 'next/link'

import { Layout } from '../components/layout'
import { LoginForm } from '../features'

const LoginPage = () => {
  const isPhone = useMediaQuery('(max-width: 768px)')
  return (
    <Layout title='Login'>
      <div className='mx-auto my-12 flex max-w-4xl items-start gap-4 rounded bg-gray-600 p-4'>
        <div className='w-full max-w-sm'>
          <Title order={4}>Login to your account</Title>
          <Text mt='xs' color='dimmed'>
            Once logged in you can book a car, view your profile and more.
          </Text>
          <Divider my='sm' />
          <LoginForm />
          <div className='mt-2 flex justify-between rounded-sm bg-gray-500 p-2 shadow-sm'>
            <Anchor component={Link} href='/register'>
              Create an account ?
            </Anchor>
            <Anchor component={Link} href='/terms-condition'>
              {/* <h1>Please Read This Carefully!!</h1> */}
              Terms And Condition
            </Anchor>
          </div>
        </div>
        {!isPhone && (
          <Image
            src='/images/car.avif'
            width={800}
            height={550}
            objectFit='cover'
            className='rounded'
            alt='Login screen hero'
          />
        )}
      </div>
    </Layout>
  )
}

export default LoginPage
