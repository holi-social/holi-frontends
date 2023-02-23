import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useLayoutEffect, useState } from 'react'

import { useAuth } from '@holi/core/auth/AuthContextProvider'

export const ONBOARDING_STORAGE_NAME = 'onboarding_finished'

export const useOnboarding = () => {
  // initial value of 'finished' must be true, otherwise React-Navigation won't have time for initialization
  const [finished, setFinished] = useState(true)
  const { isLoggedIn } = useAuth()

  const onFinish = useCallback(() => {
    AsyncStore.setItem(ONBOARDING_STORAGE_NAME, 'true')
    setFinished(true)
  }, [])

  useLayoutEffect(() => {
    if (isLoggedIn) {
      onFinish()
    } else {
      AsyncStore.getItem(ONBOARDING_STORAGE_NAME).then((result) => {
        if (!result) {
          setFinished(false)
          return
        }

        try {
          setFinished(JSON.parse(result) as boolean)
        } catch (e) {
          setFinished(false)
          return
        }
      })
    }
  }, [isLoggedIn, onFinish])

  return {
    finished,
    onFinish,
  }
}
