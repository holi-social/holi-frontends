import AsyncStore from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

import { useLoginState } from '@holi/core/auth/loginState'

export enum SpaceOnboardings {
  JoinOnboarding = 'space_join_is_onboarded',
  StorageOnboarding = 'space_storage_is_onboarded',
}

export const useSpaceOnboarding = (onboarding: SpaceOnboardings) => {
  const loginState = useLoginState()
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    if (loginState.isUnknown) {
      return
    }

    AsyncStore.getItem(onboarding)?.then(async (storedValue) => {
      if (!storedValue || storedValue !== 'true') {
        setNeedsOnboarding(true)
      }
    })
  }, [loginState.isUnknown, onboarding])

  return {
    needsOnboarding,
    setIsOnboarded: async () => {
      setNeedsOnboarding(false)
      await AsyncStore.setItem(onboarding, 'true')
    },
  }
}
