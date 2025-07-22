import { ALL_SKILLS, ALL_TOPICS } from '@holi/core/domain/shared/types'
import type { VolunteeringFilterKey } from '@holi-apps/volunteering/types'

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

export const MAX_FACET_COUNT = Math.max(
  ALL_TOPICS.length,
  ALL_SKILLS.length,
  ...Object.values(sortedFilterOptions).map((list) => list.length)
)

export const filterKeyToTranslationKeyMapping: { [key in VolunteeringFilterKey]: string } = {
  topics: 'topic',
  skills: 'skill',
  location: 'location',
  commitmentLabels: 'volunteering.engagement.commitment_label',
  commitmentDurations: 'volunteering.engagement.commitment_duration',
}

export const filterKeyToFacetMapping: { [key in VolunteeringFilterKey]: string } = {
  topics: 'topics_v2',
  skills: 'skills_v2',
  location: 'location',
  commitmentLabels: 'commitment_label',
  commitmentDurations: 'commitment_duration',
}
