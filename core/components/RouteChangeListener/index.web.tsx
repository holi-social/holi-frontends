'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { callAllCallbacks } from './callbacks'

function RouteChangeListener() {
  const pathname = usePathname()

  useEffect(() => {
    callAllCallbacks()
  }, [pathname])

  return null
}

export default RouteChangeListener
