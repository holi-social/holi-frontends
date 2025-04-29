import type { ApolloError } from '@apollo/client'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import createParamHooks, {
  arrayParamConfig,
  singleParamConfig,
  webReplaceQueryConfig,
} from '@holi/core/navigation/hooks/useParam'

import type { VolunteeringFilterParams, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { slugsToSkillsV2, slugsToTopicsV2 } from '@holi/core/domain/shared/types'

interface FilterHook {
  filters: VolunteeringFilters
  setFilters: (filters?: VolunteeringFilters) => void
  clearFilters: () => void
  isFiltering: boolean
  geolocationSelection?: GeolocationSuggestion
  geolocationError?: ApolloError
  loadingGeolocation: boolean
}

const { useParam, useUpdateParams } = createParamHooks<VolunteeringFilterParams>()

const useDiscoveryV1Filters = (): FilterHook => {
  const [topicParams] = useParam('topic', arrayParamConfig)
  const [skillParams] = useParam('skill', arrayParamConfig)
  const topics = slugsToTopicsV2(topicParams)
  const skills = slugsToSkillsV2(skillParams)
  const [geolocationId] = useParam('geolocationId', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const geolocationProps = useGeolocationDetailsWithSuggestion(geolocationId, (error) =>
    displayError(error, 'Failed to load geolocation details', {
      displayMessage: t('volunteering:listing.error'),
      location: 'useDiscoveryV1Filters.useGeolocationDetailsWithSuggestion',
      geolocationId,
    })
  )

  const [filters, setFilters] = useState<VolunteeringFilters>({
    location: geolocationProps.geolocationSuggestion,
    topics,
    skills,
  })
  const isFiltering = !!(filters.location || filters.topics?.length || filters.skills?.length)

  const onFilterChange = useCallback(
    ({ topics, skills, location }: VolunteeringFilters = {}) => {
      setFilters({ topics, skills, location })
      updateParams({ topic: topics, skill: skills, geolocationId: location?.id })
    },
    [updateParams]
  )
  const clearFilters = useCallback(() => {
    setFilters({})
    updateParams({
      topic: undefined,
      skill: undefined,
      geolocationId: undefined,
    })
  }, [updateParams])

  return { filters, setFilters: onFilterChange, clearFilters, isFiltering, ...geolocationProps }
}

export const useVolunteeringFilters = (onSubmit: () => void) => {
  const { setFilters, ...filterProps } = useDiscoveryV1Filters()

  const submit = useCallback(
    (filters?: VolunteeringFilters) => {
      setFilters(filters)
      onSubmit()
    },
    [onSubmit, setFilters]
  )

  useEffect(() => {
    if (filterProps.loadingGeolocation) {
      return
    }
    if (filterProps.geolocationSelection?.id !== filterProps.geolocationSelection?.id) {
      setFilters({ ...filterProps.filters, location: filterProps.geolocationSelection })
    }
  }, [filterProps, setFilters])

  return { ...filterProps, submit }
}
