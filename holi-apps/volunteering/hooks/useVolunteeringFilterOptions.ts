import { useMemo } from 'react'
import { type TermWithLabel, useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useTranslation } from 'react-i18next'
import type { TypesenseFacetCounts } from '@holi/core/typesense/types'
import {
  filterKeyToFacetMapping,
  filterKeyToTranslationKeyMapping,
  sortedFilterOptions,
} from '@holi-apps/volunteering/helpers/filterFacetData'

type VolunteeringFilterOption = TermWithLabel & {
  counter?: number
}

export const useVolunteeringFilterOptions = (
  filterKey: keyof Omit<VolunteeringFilters, 'location'>,
  facetCounts: TypesenseFacetCounts = {}
): VolunteeringFilterOption[] => {
  const { t } = useTranslation()
  const sortedTopics = useSortedTerms('topic')
  const sortedSkills = useSortedTerms('skill')
  const i18nKey = filterKeyToTranslationKeyMapping[filterKey]
  const filterFacetCounts = facetCounts[filterKeyToFacetMapping[filterKey]]

  const options = useMemo(() => {
    if (filterKey === 'topics') {
      return sortedTopics
    } else if (filterKey === 'skills') {
      return sortedSkills
    }

    return sortedFilterOptions[filterKey].map((term) => ({
      term,
      label: t(`${i18nKey}.${term}`),
    }))
  }, [filterKey, i18nKey, sortedSkills, sortedTopics, t])

  const optionsWithFacetCounts = useMemo(() => {
    return options.map((option) => ({
      ...option,
      counter: filterFacetCounts ? (filterFacetCounts[option.term] ?? 0) : undefined,
    }))
  }, [filterFacetCounts, options])

  return optionsWithFacetCounts
}
