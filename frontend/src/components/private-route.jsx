import { LoadingOverlay } from '@mantine/core'
import { useRouter } from 'next/router'
import React from 'react'
import { useEffect } from 'react'

import { useUser } from '../hooks/use-user'

export const PrivateRoute = ({ next, allowedRoles, children }) => {
  const router = useRouter()
  const { data, isLoading, error } = useUser()
  useEffect(() => {
    if (!isLoading && !error && !data) {
      return router.push({
        pathname: '/login',
        query: next ? { next: next } : undefined
      })
    }
    if (data && allowedRoles && !allowedRoles.includes(data.role)) {
      return router.push('/')
    }
  }, [allowedRoles, data, error, isLoading, next, router])
  if (isLoading || !data) return <LoadingOverlay />
  return <>{children}</>
}
