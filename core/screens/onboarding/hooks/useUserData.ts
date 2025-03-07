import { useCallback, useEffect, useReducer } from 'react'

import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import type { ContentValue, OnboardingUserData } from '@holi/core/screens/onboarding/types'
import {
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '@holi/core/screens/onboarding/helpers/onboardingUserDataAsyncStore'

interface SetUserDataAction {
  type: 'SET_USER_DATA'
  payload: OnboardingUserData
}

interface UpdateContentAction {
  type: 'UPDATE_CONTENT'
  payload: ContentValue | undefined
}

interface UpdateLocationAction {
  type: 'UPDATE_LOCATION'
  payload: GeolocationSuggestion | undefined
}

interface UpdateInterestsAction {
  type: 'UPDATE_INTERESTS'
  payload: string[]
}

interface UpdateSkillsAction {
  type: 'UPDATE_SKILLS'
  payload: string[]
}

type OnboardingAction =
  | SetUserDataAction
  | UpdateContentAction
  | UpdateLocationAction
  | UpdateInterestsAction
  | UpdateSkillsAction

const initialUserData = {
  content: undefined,
  location: undefined,
  interests: [],
  skills: [],
}

const reducer = (state: OnboardingUserData, action: OnboardingAction) => {
  let updatedUserData = { ...state }
  switch (action.type) {
    case 'SET_USER_DATA':
      updatedUserData = action.payload
      break
    case 'UPDATE_CONTENT':
      updatedUserData = { ...state, content: action.payload }
      break
    case 'UPDATE_LOCATION':
      updatedUserData = { ...state, location: action.payload }
      break
    case 'UPDATE_INTERESTS':
      updatedUserData = { ...state, interests: action.payload }
      break
    case 'UPDATE_SKILLS':
      updatedUserData = { ...state, skills: action.payload }
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
        dispatch({ type: 'SET_USER_DATA', payload: userData })
      }
    })
  }, [])

  const onChipSelect = useCallback(
    (chipType: 'interests' | 'skills', term: string) =>
      userData[chipType].some((selectedTerm) => selectedTerm === term)
        ? userData[chipType].filter((selectedTerm) => selectedTerm !== term)
        : [...userData[chipType], term],
    [userData]
  )

  const updateContent = (content: ContentValue | undefined) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: content })
  }

  const updateLocation = (location: GeolocationSuggestion | undefined) => {
    dispatch({ type: 'UPDATE_LOCATION', payload: location })
  }

  const updateInterests = (interest: string) => {
    dispatch({ type: 'UPDATE_INTERESTS', payload: onChipSelect('interests', interest) })
  }

  const updateSkills = (skill: string) => {
    dispatch({ type: 'UPDATE_SKILLS', payload: onChipSelect('skills', skill) })
  }

  const clearInterests = () => {
    dispatch({ type: 'UPDATE_INTERESTS', payload: [] })
  }

  const clearSkills = () => {
    dispatch({ type: 'UPDATE_SKILLS', payload: [] })
  }

  return {
    userData,
    updateContent,
    updateLocation,
    updateInterests,
    updateSkills,
    clearInterests,
    clearSkills,
  }
}
