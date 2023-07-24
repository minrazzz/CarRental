import { useState } from 'react'

export const ClientOnly = ({ children }) => {
  const [isClient] = useState(() => typeof window !== 'undefined')
  return isClient ? children : null
}
