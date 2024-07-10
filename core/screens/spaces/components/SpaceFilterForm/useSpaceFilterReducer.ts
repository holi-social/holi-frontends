import { useReducer } from 'react'

import { HoliError } from '@holi/core/errors/classes/HoliError'

import type { SpaceFilter } from './types'

export const getSpaceFilterInitialState = (initFilter: Partial<SpaceFilter> = {}): SpaceFilter => ({
  locationSearchQuery: '',
  location: undefined,
  topicSlugs: [],
  skillSlugs: [],
  ...initFilter,
})

interface SpaceFilterResetAllAction {
  type: 'RESET_ALL'
  initState?: Partial<SpaceFilter>
}

interface SpaceFilterResetAction {
  type: 'RESET'
  filterKeys: Array<keyof SpaceFilter>
}

interface SpaceFilterLocationSearchQueryUpdateAction {
  type: 'LOCATION_SEARCH_QUERY_UPDATE'
  value: string | undefined
}

interface SpaceFilterLocationUpdateAction {
  type: 'LOCATION_UPDATE'
  value: SpaceFilter['location'] | undefined
}

interface SpaceFilterSlugUpdateAction {
  type: 'TOPIC_SLUG_UPDATE' | 'SKILL_SLUG_UPDATE'
  value: string
}

type SpaceFilterAction =
  | SpaceFilterResetAllAction
  | SpaceFilterResetAction
  | SpaceFilterLocationSearchQueryUpdateAction
  | SpaceFilterLocationUpdateAction
  | SpaceFilterSlugUpdateAction

const spaceFilterReducer = (state: SpaceFilter, action: SpaceFilterAction): SpaceFilter => {
  switch (action.type) {
    case 'RESET_ALL':
      return getSpaceFilterInitialState(action.initState)

    case 'RESET':
      return {
        ...state,
        ...Object.fromEntries(action.filterKeys.map((key) => [key, getSpaceFilterInitialState()[key]])),
      }

    case 'LOCATION_SEARCH_QUERY_UPDATE':
      return {
        ...state,
        locationSearchQuery: action.value,
      }

    case 'LOCATION_UPDATE':
      return {
        ...state,
        locationSearchQuery: action.value?.label ?? state.locationSearchQuery,
        location: action.value,
      }

    case 'SKILL_SLUG_UPDATE':
      return {
        ...state,
        skillSlugs: state.skillSlugs.includes(action.value)
          ? state.skillSlugs.filter((slugId) => slugId !== action.value)
          : [...state.skillSlugs, action.value],
      }

    case 'TOPIC_SLUG_UPDATE':
      return {
        ...state,
        topicSlugs: state.topicSlugs.includes(action.value)
          ? state.topicSlugs.filter((slugId) => slugId !== action.value)
          : [...state.topicSlugs, action.value],
      }

    default:
      throw new HoliError('Incorect action type used for SpaceFilterAction in spaceFilterReducer')
  }
}

export const useSpaceFilterReducer = (initFilterState = getSpaceFilterInitialState()) => {
  const [filterState, dispatch] = useReducer(spaceFilterReducer, initFilterState)

  const resetAllFilters = (initState?: SpaceFilter) =>
    dispatch({ type: 'RESET_ALL', initState: getSpaceFilterInitialState(initState) })

  const resetFilter = (...filterKeys: Array<keyof SpaceFilter>) => dispatch({ type: 'RESET', filterKeys })

  const updateLocationSearchQuery = (locationSearchQuery?: string) =>
    dispatch({ type: 'LOCATION_SEARCH_QUERY_UPDATE', value: locationSearchQuery })

  const updateLocation = (location?: SpaceFilter['location']) => dispatch({ type: 'LOCATION_UPDATE', value: location })

  const updateSkillSlugs = (skillSlug: string) => dispatch({ type: 'SKILL_SLUG_UPDATE', value: skillSlug })

  const updateTopicSlugs = (topicSlug: string) => dispatch({ type: 'TOPIC_SLUG_UPDATE', value: topicSlug })

  return {
    filterState,
    resetAllFilters,
    resetFilter,
    updateLocationSearchQuery,
    updateLocation,
    updateSkillSlugs,
    updateTopicSlugs,
  }
}
