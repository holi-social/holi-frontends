import React from 'react'
import { useCallback, useEffect, useState } from 'react'

import { useDebounce } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'

import { TrackingConsentModalDesktop } from './TrackingConsentModalDesktop'
import { TrackingConsentModalMobile } from './TrackingConsentModalMobile'

export { useUserVisitedScreensCount } from './userVisitedScreensCount'

const TrackingConsentModal = () => {
  const [isMobileViewPort, setIsMobileViewPort] = useState(false)

  const updateMobileViewPort = useDebounce(
    useCallback(() => {
      setIsMobileViewPort(dimensions.breakpointL > window.innerWidth)
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
