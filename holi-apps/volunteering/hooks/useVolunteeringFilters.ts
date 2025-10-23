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
import type { ErrorLike } from '@apollo/client'

interface FilterHook {
  filters: VolunteeringFilters
  setFilters: (filters?: VolunteeringFilters) => void
  clearFilters: () => void
  isFiltering: boolean
  geolocationSelection?: GeolocationSuggestion
  geolocationError?: ErrorLike
  loadingGeolocation: boolean
}

const { useParam, useUpdateParams } = createParamHooks<VolunteeringFilterParams>()

const useDiscoveryV1Filters = (): FilterHook => {
  const [remoteParam] = useParam('remote', singleParamConfig)
  const remote = remoteParam === 'true'
  const [topicParams] = useParam('topic', arrayParamConfig)
  const [skillParams] = useParam('skill', arrayParamConfig)
  const topics = slugsToTopicsV2(topicParams)
  const skills = slugsToSkillsV2(skillParams)
  const [geolocationId] = useParam('geolocationId', singleParamConfig)
  const [commitmentDurations] = useParam('duration', arrayParamConfig)
  const [commitmentLabels] = useParam('commitment', arrayParamConfig)
  const updateParams = useUpdateParams(webReplaceQueryConfig)

  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const geolocationProps = useGeolocationDetailsWithSuggestion(geolocationId, (error) =>
    displayError(error, 'Failed to load geolocation details', {
      displayMessage: t('volunteering.listing.error'),
      location: 'useDiscoveryV1Filters.useGeolocationDetailsWithSuggestion',
      geolocationId,
    })
  )

  const [filters, setFilters] = useState<VolunteeringFilters>({
    remote: remoteParam ? remote : undefined,
    location: geolocationProps.geolocationSuggestion,
    topics,
    skills,
    commitmentDurations,
    commitmentLabels,
  })
  const isFiltering = !!(
    filters.remote ||
    filters.location ||
    filters.topics?.length ||
    filters.skills?.length ||
    filters.commitmentDurations?.length ||
    filters.commitmentLabels?.length
  )

  const onFilterChange = useCallback(
    ({ remote, topics, skills, location, commitmentDurations, commitmentLabels }: VolunteeringFilters = {}) => {
      setFilters({ remote, topics, skills, location, commitmentDurations, commitmentLabels })
      updateParams({
        remote: remote ? 'true' : undefined,
        topic: topics,
        skill: skills,
        geolocationId: location?.id,
        duration: commitmentDurations,
        commitment: commitmentLabels,
      })
    },
    [updateParams]
  )
  const clearFilters = useCallback(() => {
    setFilters({})
    updateParams({
      remote: undefined,
      topic: undefined,
      skill: undefined,
      geolocationId: undefined,
      duration: undefined,
      commitment: undefined,
    })
  }, [updateParams])

  return { filters, setFilters: onFilterChange, clearFilters, isFiltering, ...geolocationProps }
}

export const useVolunteeringFilters = () => {
  const { setFilters, ...filterProps } = useDiscoveryV1Filters()

  useEffect(() => {
    if (filterProps.loadingGeolocation) {
      return
    }
    if (filterProps.geolocationSelection?.id !== filterProps.geolocationSelection?.id) {
      setFilters({ ...filterProps.filters, location: filterProps.geolocationSelection })
    }
  }, [filterProps, setFilters])

  return { ...filterProps, submit: setFilters }
}
