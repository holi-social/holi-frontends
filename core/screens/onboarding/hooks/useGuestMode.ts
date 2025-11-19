import { getGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import { useEffect, useState } from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

export const useGuestMode = () => {
  const [guestMode, setGuestMode] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isLoggedIn } = useLoggedInUser()

  useEffect(() => {
    getGuestMode().then((mode) => {
      setGuestMode(mode)
      setIsLoading(false)
    })
  }, [isLoggedIn])

  return {
    guestMode,
    isLoading,
  }
}
