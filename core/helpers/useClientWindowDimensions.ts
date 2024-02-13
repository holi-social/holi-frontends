import { useState } from 'react'
import { ScaledSize, useWindowDimensions } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

const defaultDimensions = { width: 0, height: 0, scale: 1, fontScale: 1 }

export const useClientWindowDimensions = () => {
  const dimensions = useWindowDimensions()
  const [clientDimensions, setClientDimensions] = useState<ScaledSize>(defaultDimensions)

  useIsomorphicLayoutEffect(() => {
    setClientDimensions(dimensions)
  }, [dimensions])

  return clientDimensions
}
