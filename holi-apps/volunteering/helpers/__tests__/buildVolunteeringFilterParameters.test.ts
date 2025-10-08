import { fullFilters } from '@holi-apps/volunteering/__tests__/testData'
import { buildTopicsAndSkillsEmbedding } from '@holi-apps/volunteering/helpers/buildTopicAndSkillsEmbedding'
import { buildVolunteeringFilterParameters } from '@holi-apps/volunteering/helpers/buildVolunteeringFilterParameters'
import type { VolunteeringFilterKey } from '@holi-apps/volunteering/types'

describe('buildVolunteeringFilterParameters', () => {
  const testDataFilters: {
    filterKey: VolunteeringFilterKey
    filterQuery: string
    excludeFilterQuery: string
  }[] = [
    {
      filterKey: 'topics',
      filterQuery: 'topics_v2',
      excludeFilterQuery:
        'type:=[volunteering,task]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
    },
    {
      filterKey: 'skills',
      filterQuery: 'skills_v2',
      excludeFilterQuery:
        'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
    },
    {
      filterKey: 'commitmentDurations',
      filterQuery: 'commitment_duration',
      excludeFilterQuery:
        'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
    },
    {
      filterKey: 'commitmentLabels',
      filterQuery: 'commitment_label',
      excludeFilterQuery:
        'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
    },
  ]

  it.each(testDataFilters)(
    'should create correct parameters when filtering by $filterKey only',
    ({ filterKey, filterQuery }) => {
      const values = fullFilters[filterKey] as string[]
      const topicsSkillsEmbedding = ['topics', 'skills'].includes(filterKey)
        ? buildTopicsAndSkillsEmbedding({ [filterKey]: values })
        : undefined

      const parameters = buildVolunteeringFilterParameters({ [filterKey]: values })

      expect(parameters).toEqual({
        filter_by: `type:=[volunteering,task]&&${filterQuery}:=[${values.join(',')}]`,
        sort_by: topicsSkillsEmbedding
          ? `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`
          : '',
      })
    }
  )

  it('should create correct parameters when filtering by location only', () => {
    const parameters = buildVolunteeringFilterParameters({ location: fullFilters.location })

    expect(parameters).toEqual({
      filter_by: 'type:=[volunteering,task]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
      sort_by: 'location_lat_lng(1,2,precision:5km):asc',
    })
  })

  it('should create correct parameters when filtering by topics and skills', () => {
    const filters = { topics: fullFilters.topics, skills: fullFilters.skills }
    const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(filters)

    const parameters = buildVolunteeringFilterParameters(filters)

    expect(parameters).toEqual({
      filter_by:
        'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]',
      sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc`,
    })
  })

  it('should create correct parameters when filtering by all filters', () => {
    const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(fullFilters)

    const parameters = buildVolunteeringFilterParameters(fullFilters)

    expect(parameters).toEqual({
      filter_by:
        'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&location_type:!=[remote]',
      sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc,location_lat_lng(1,2,precision:5km):asc`,
    })
  })

  it.each(testDataFilters)(
    'should create correct parameters when excluding filtering for $filterKey',
    ({ filterKey, excludeFilterQuery }) => {
      const topicsSkillsEmbedding = buildTopicsAndSkillsEmbedding(fullFilters)

      const parameters = buildVolunteeringFilterParameters(fullFilters, { excludeFilter: filterKey })

      expect(parameters).toEqual({
        filter_by: excludeFilterQuery,
        sort_by: `_vector_query(topics_skills_embedding_v2:(${JSON.stringify(topicsSkillsEmbedding)})):asc,location_lat_lng(1,2,precision:5km):asc`,
      })
    }
  )
})
