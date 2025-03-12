import type { ApolloError } from '@apollo/client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useGeolocationDetails } from '@holi/core/geolocation/hooks/useGeolocationDetails'
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

const useGeolocation = (locationId?: string) => {
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  // TODO(SF) querying name would suffice for discovery v1
  const { geolocationDetails, geolocationError, loadingGeolocation } = useGeolocationDetails(locationId)

  const geolocationSelection = useMemo<GeolocationSuggestion | undefined>(() => {
    if (!locationId) {
      return undefined
    }
    return (
      geolocationDetails && {
        ...geolocationDetails,
        label: geolocationDetails.name,
      }
    )
  }, [geolocationDetails, locationId])

  useEffect(() => {
    if (geolocationError) {
      displayError(geolocationError, 'Failed to load geolocation details', {
        displayMessage: t('volunteering:listing.error'),
        location: 'VolunteeringAppHome.useEffect',
        locationId,
      })
    }
  }, [displayError, geolocationError, locationId, t])

  return {
    geolocationSelection,
    geolocationError,
    loadingGeolocation: loadingGeolocation || (!!locationId && !(geolocationDetails || geolocationError)),
  }
}

const useDiscoveryV1Filters = (): FilterHook => {
  const [topicParams] = useParam('topic', arrayParamConfig)
  const [skillParams] = useParam('skill', arrayParamConfig)
  const topics = slugsToTopicsV2(topicParams)
  const skills = slugsToSkillsV2(skillParams)
  const [geolocationId] = useParam('geolocationId', singleParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)
  const { geolocationSelection, ...geolocationProps } = useGeolocation(geolocationId)

  const [filters, setFilters] = useState<VolunteeringFilters>({ location: geolocationSelection, topics, skills })
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
