import { Burger, Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { useUser } from '../hooks/use-user'

export const Navbar = () => {
  const { data: user } = useUser()
  const router = useRouter()
  const isPhone = useMediaQuery('(max-width: 768px)')
  const [opened, setOpened] = useState(false)

  const navbarLinks = user ? navLinks.loggedIn : navLinks.loggedOut
  const navlist = useMemo(
    () =>
      classNames('flex gap-2 transition-all duration-500', {
        'absolute w-56 top-20 right-4 bg-gray-600 z-40 flex-col p-2 rounded-md shadow-2xl':
          isPhone,
        'visible translate-y-0 opacity-100': opened,
        'invisible translate-y-2 opacity-0': !opened && isPhone
      }),
    [isPhone, opened]
  )
  useEffect(() => {
    // automatically close the hamburger when navigating to a different page
    const handleRouteChangeStart = () => setOpened(false)
    router.events.on('routeChangeStart', () => setOpened(false))
    return () => router.events.off('routeChangeStart', handleRouteChangeStart)
  }, [router.events])
  return (
    <nav className='sticky top-0 left-0 z-10 flex items-center justify-between bg-gray-600/75 p-4 shadow backdrop-blur-md lg:mb-4 lg:px-6 lg:py-3'>
      <Link href='/'>
        <a className='block text-4xl font-extrabold uppercase text-purple-600'>
          MotoInc
        </a>
      </Link>
      <ul className={navlist}>
        {navbarLinks.map(({ name, href }) => (
          <li key={name}>
            <Button
              variant={router.pathname === href ? 'filled' : 'default'}
              onClick={() => router.push(href)}
              fullWidth={isPhone}
            >
              {name}
            </Button>
          </li>
        ))}
        {user && user.role === 'admin' ? (
          <li>
            <Button
              variant={router.asPath === '/admin' ? 'filled' : 'default'}
              onClick={() => router.push('/admin')}
              fullWidth={isPhone}
            >
              Admin
            </Button>
          </li>
        ) : null}
      </ul>
      <Burger
        className='lg:hidden'
        opened={opened}
        onClick={() => setOpened(opened => !opened)}
        title='Show menu'
      />
    </nav>
  )
}
const navLinks = {
  loggedOut: [
    {
      name: 'Login',
      href: '/login'
    },
    {
      name: 'Create an account',
      href: '/register'
    }
  ],
  loggedIn: [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'Profile',
      href: '/profile'
    }
  ]
}
