import { useMemo } from 'react'
import { type TermWithLabel, useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'
import type { VolunteeringFilterKey, VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useTranslation } from 'react-i18next'
import type { TypesenseFacetCounts } from '@holi/core/typesense/types'

type VolunteeringFilterOption = TermWithLabel & {
  counter?: number
}

export const sortedFilterOptions = {
  commitmentLabels: ['one-time', 'recurring', 'negotiable'],
  commitmentDurations: [
    'MINUTES_10to15',
    'MINUTES_15to30',
    'MINUTES_30to60',
    'HOURS_1to2',
    'HOURS_2to4',
    'HOURS_4to6',
    'DAYS_1',
    'DAYS_2',
    'DAYS_3_OR_MORE',
    'INDETERMINATE',
  ],
}

export const filterTranslationKeyMapping: { [key in VolunteeringFilterKey]: string } = {
  topics: 'topic',
  skills: 'skill',
  location: 'location',
  commitmentLabels: 'volunteering.engagement.commitment_label',
  commitmentDurations: 'volunteering.engagement.commitment_duration',
}

const filterKeyToFacetMapping: { [key in VolunteeringFilterKey]: string } = {
  topics: 'topics_v2',
  skills: 'skills_v2',
  location: 'location',
  commitmentLabels: 'commitment_label',
  commitmentDurations: 'commitment_duration',
}

export const useVolunteeringFilterOptions = (
  filterKey: keyof Omit<VolunteeringFilters, 'location'>,
  facetCounts: TypesenseFacetCounts = {}
): VolunteeringFilterOption[] => {
  const { t } = useTranslation()
  const sortedTopics = useSortedTerms('topic')
  const sortedSkills = useSortedTerms('skill')
  const i18nKey = filterTranslationKeyMapping[filterKey]
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
      counter: (filterFacetCounts ?? {})[option.term],
    }))
  }, [filterFacetCounts, options])

  return optionsWithFacetCounts
}
