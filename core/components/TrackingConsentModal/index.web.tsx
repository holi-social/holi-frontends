import React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useDebounce } from '@holi/ui/helper'

import { TrackingConsentModalDesktop } from './TrackingConsentModalDesktop'
import { TrackingConsentModalMobile } from './TrackingConsentModalMobile'
import { breakpoints } from 'holi-bricks/foundations'

export { default as TrackingGeneralContentDescription } from './TrackingGeneralContentDescription'

const TrackingConsentModal = () => {
  const [isMobileViewPort, setIsMobileViewPort] = useState(false)

  const updateMobileViewPort = useDebounce(
    useCallback(() => {
      setIsMobileViewPort(breakpoints.lg > window.innerWidth)
    }, []),
    100
  )

  useEffect(() => {
    // on initial component load
    updateMobileViewPort()

    window.addEventListener('resize', updateMobileViewPort)
    return () => window.removeEventListener('resize', updateMobileViewPort)
  }, [updateMobileViewPort])

  return isMobileViewPort ? <TrackingConsentModalMobile /> : <TrackingConsentModalDesktop />
}

export default TrackingConsentModal
