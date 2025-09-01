import { useEffect, useReducer } from 'react'

import type { OnboardingUserData } from '@holi/core/screens/onboarding/types'
import {
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'

interface SetUserDataAction {
  type: 'SET_USER_DATA'
  payload: OnboardingUserData
}

type OnboardingAction = SetUserDataAction

const initialUserData: OnboardingUserData = {
  // Simplified - no data to store during onboarding
}

const reducer = (state: OnboardingUserData, action: OnboardingAction) => {
  let updatedUserData = { ...state }
  switch (action.type) {
    case 'SET_USER_DATA':
      updatedUserData = action.payload
      break
  }

  storeOnboardingUserDataAsyncStore(updatedUserData)

  return updatedUserData
}

export const useUserData = () => {
  const [userData, dispatch] = useReducer(reducer, { ...initialUserData })

  useEffect(() => {
    getOnboardingUserDataAsyncStore().then((userData) => {
      if (userData) {
        dispatch({
          type: 'SET_USER_DATA',
          payload: userData,
        })
      }
    })
  }, [])

  return {
    userData,
  }
}
