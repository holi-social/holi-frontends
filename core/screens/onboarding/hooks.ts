import { makeVar, useReactiveVar } from '@apollo/client'
import AsyncStore from '@react-native-async-storage/async-storage'
import { useCallback, useLayoutEffect } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'

export const ONBOARDING_STORAGE_NAME = 'onboarding_finished'

// initial value of 'finished' must be true, otherwise React-Navigation won't have time for initialization on mobile
const finished = makeVar(true)

export const useOnboarding = () => {
  const { isLoggedIn } = useAuth()

  const onFinish = useCallback(() => {
    finished(true)
    AsyncStore.setItem(ONBOARDING_STORAGE_NAME, 'true')
  }, [])

  useLayoutEffect(() => {
    if (isLoggedIn) {
      onFinish()
    } else {
      AsyncStore.getItem(ONBOARDING_STORAGE_NAME)?.then((result) => {
        if (!result) {
          finished(false)
          return
        }

        try {
          const storedValue = JSON.parse(result) as boolean
          finished(storedValue)
        } catch (e) {
          finished(false)
          return
        }
      })
    }
  }, [isLoggedIn, onFinish])

  return {
    finished: useReactiveVar(finished),
    onFinish,
  }
}
