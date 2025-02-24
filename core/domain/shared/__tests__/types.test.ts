import { type TopicV2, slugToTopicV2, topicV2Slugs } from '@holi/core/domain/shared/types'

describe('slugToTopicV2', () => {
  const testCases = new Map<string, TopicV2 | undefined>([
    // ANIMAL_WELFARE
    ['animal-welfare', 'animal-welfare'],
    ['biodiversity-animal-welfare', 'animal-welfare'],

    // ARTS_CULTURE
    ['arts-culture', 'arts-culture'],
    ['culture-social-change', 'arts-culture'],

    // CLIMATE_ENVIRONMENT
    ['climate-environment', 'climate-environment'],
    ['climate-protection', 'climate-environment'],
    ['water-ocean', 'climate-environment'],
    ['energy-transition', 'climate-environment'],
    ['natural-resources', 'climate-environment'],

    // DEMOCRACY_POLITICS
    ['democracy-politics', 'democracy-politics'],
    ['governance', 'democracy-politics'],
    ['politics-society', 'democracy-politics'],

    // DISABILITY_INCLUSION
    ['disability-inclusion', 'disability-inclusion'],
    ['disabilities-inclusion', 'disability-inclusion'],

    // DISASTER_RELIEF
    ['disaster-relief', 'disaster-relief'],
    ['natural-disaster-response', 'disaster-relief'],

    // ELDERLY_CARE
    ['elderly-care', 'elderly-care'],
    ['elderly-people', 'elderly-care'],

    // FAMILY_KIDS
    ['family-kids', 'family-kids'],

    // FOOD_HUNGER_RELIEF
    ['food-hunger-relief', 'food-hunger-relief'],
    ['agriculture-food', 'food-hunger-relief'],

    // GENDER_EQUALITY
    ['gender-equality', 'gender-equality'],
    ['diversity-genderequality', 'gender-equality'],

    // HOUSING
    ['housing', 'housing'],
    ['building-housing', 'housing'],

    // HUMAN_RIGHTS
    ['human-rights', 'human-rights'],
    ['democracy-human-rights', 'human-rights'],

    // LGBTQIA_PLUS
    ['lgbtqia-plus', 'lgbtqia-plus'],

    // LIFESTYLE_CONSUMPTION
    ['lifestyle-consumption', 'lifestyle-consumption'],
    ['consumption-lifestyle', 'lifestyle-consumption'],
    ['eco-tourism', 'lifestyle-consumption'],

    // LITERACY_EDUCATION
    ['literacy-education', 'literacy-education'],
    ['education-science', 'literacy-education'],

    // MENTAL_PHYSICAL_HEALTH
    ['mental-physical-health', 'mental-physical-health'],
    ['physical-mental-health', 'mental-physical-health'],

    // MIGRATION_REFUGEES
    ['migration-refugees', 'migration-refugees'],
    ['migration-integration', 'migration-refugees'],

    // MOBILITY_TRANSPORT
    ['mobility-transport', 'mobility-transport'],
    ['mobility-infrastructure', 'mobility-transport'],

    // OTHER
    ['other', 'other'],
    ['alternative-economy', 'other'],
    ['urban-rural-development', 'other'],

    // PEACE_SECURITY
    ['peace-security', 'peace-security'],

    // POVERTY_HOMELESSNESS
    ['poverty-homelessness', 'poverty-homelessness'],
    ['poverty-homelesness', 'poverty-homelessness'],

    // SPORTS_RECREATION
    ['sports-recreation', 'sports-recreation'],

    // TECHNOLOGY_INNOVATION
    ['technology-innovation', 'technology-innovation'],
    ['technological-innovation', 'technology-innovation'],

    // YOUTH_DEVELOPMENT
    ['youth-development', 'youth-development'],
    ['children-youth', 'youth-development'],

    // Edge cases
    ['', undefined],
    ['unknown-slug', undefined],
  ])

  // Test all mappings
  test.each(Array.from(testCases.entries()))('%s → %s', (input, expected) => {
    expect(slugToTopicV2(input)).toBe(expected)
  })

  // Verify all enum values are covered
  test('should have test cases for all TopicV2 enum values', () => {
    const allTopicValues = Object.keys(topicV2Slugs)
    const testedTopicValues = new Set(testCases.values())

    allTopicValues.forEach((topic) => {
      expect(testedTopicValues).toContain(topic)
    })
  })
})
