import { useState } from 'react'
import { useWindowDimensions } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { featureFlag } from '@holi/web/environment'

const defaultDimensions = { width: 0, height: 0, scale: 1, fontScale: 1 }

export const useClientWindowDimensions = () => {
  const dimensions = useWindowDimensions()
  const [clientDimensions, setClientDimensions] = useState(featureFlag.enableSSR ? defaultDimensions : dimensions)

  useIsomorphicLayoutEffect(() => {
    if (featureFlag.enableSSR) {
      setClientDimensions(dimensions)
    }
  }, [dimensions])

  return clientDimensions
}
