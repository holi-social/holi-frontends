import { useCallback, useEffect, useReducer, useState } from 'react'

import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
// eslint-disable-next-line no-restricted-imports
import type { ContentValue, OnboardingUserData } from '../types'
// eslint-disable-next-line no-restricted-imports
import {
  getOnboardingUserDataAsyncStore,
  storeOnboardingUserDataAsyncStore,
} from '../helpers/onboardingUserDataAsyncStore'

interface SetUserDataAction {
  type: 'SET_USER_DATA'
  payload: OnboardingUserData
}

interface UpdateContentAction {
  type: 'UPDATE_CONTENT'
  payload: ContentValue
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
  content: null,
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
  const [interestsSearchString, setInterestsSearchString] = useState('')
  const [skillsSearchString, setSkillsSearchString] = useState('')

  useEffect(() => {
    getOnboardingUserDataAsyncStore().then((userData) => {
      if (userData) {
        dispatch({ type: 'SET_USER_DATA', payload: userData })
      }
    })
  }, [])

  const onChipSelect = useCallback(
    (chipType: 'interests' | 'skills', id: string) =>
      userData[chipType].some((selectedTermId) => selectedTermId === id)
        ? userData[chipType].filter((selectedTermId) => selectedTermId !== id)
        : [...userData[chipType], id],
    [userData]
  )

  const updateContent = (content: ContentValue) => {
    dispatch({ type: 'UPDATE_CONTENT', payload: content })
  }

  const updateLocation = (location: GeolocationSuggestion | undefined) => {
    dispatch({ type: 'UPDATE_LOCATION', payload: location })
  }

  const updateInterests = (interestId: string) => {
    dispatch({ type: 'UPDATE_INTERESTS', payload: onChipSelect('interests', interestId) })
  }

  const updateSkills = (skillId: string) => {
    dispatch({ type: 'UPDATE_SKILLS', payload: onChipSelect('skills', skillId) })
  }

  return {
    userData,
    updateContent,
    updateLocation,
    updateInterests,
    updateSkills,
    interestsSearchProps: {
      filterString: interestsSearchString,
      onFilterStringChange: setInterestsSearchString,
    },
    skillsSearchProps: {
      filterString: skillsSearchString,
      onFilterStringChange: setSkillsSearchString,
    },
  }
}
