import { getGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { useEffect, useState } from 'react'

export const useGuestMode = () => {
  const [guestMode, setGuestMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    getGuestMode().then((mode) => {
      setGuestMode(mode)
      setIsLoading(false)
    })
  }, [])

  return {
    guestMode,
    isLoading,
  }
}
