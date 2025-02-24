import { TopicV2, slugToTopicV2 } from '@holi/core/domain/shared/types';

describe('slugToTopicV2', () => {
  const testCases = new Map<string, TopicV2>([
    // ANIMAL_WELFARE
    ['animal-welfare', TopicV2.ANIMAL_WELFARE],
    ['biodiversity-animal-welfare', TopicV2.ANIMAL_WELFARE],

    // ARTS_CULTURE
    ['arts-culture', TopicV2.ARTS_CULTURE],
    ['culture-social-change', TopicV2.ARTS_CULTURE],

    // CLIMATE_ENVIRONMENT
    ['climate-environment', TopicV2.CLIMATE_ENVIRONMENT],
    ['climate-protection', TopicV2.CLIMATE_ENVIRONMENT],
    ['water-ocean', TopicV2.CLIMATE_ENVIRONMENT],
    ['energy-transition', TopicV2.CLIMATE_ENVIRONMENT],
    ['natural-resources', TopicV2.CLIMATE_ENVIRONMENT],

    // DEMOCRACY_POLITICS
    ['democracy-politics', TopicV2.DEMOCRACY_POLITICS],
    ['governance', TopicV2.DEMOCRACY_POLITICS],
    ['politics-society', TopicV2.DEMOCRACY_POLITICS],

    // DISABILITY_INCLUSION
    ['disability-inclusion', TopicV2.DISABILITY_INCLUSION],
    ['disabilities-inclusion', TopicV2.DISABILITY_INCLUSION],

    // DISASTER_RELIEF
    ['disaster-relief', TopicV2.DISASTER_RELIEF],
    ['natural-disaster-response', TopicV2.DISASTER_RELIEF],

    // ELDERLY_CARE
    ['elderly-care', TopicV2.ELDERLY_CARE],
    ['elderly-people', TopicV2.ELDERLY_CARE],

    // FAMILY_KIDS
    ['family-kids', TopicV2.FAMILY_KIDS],

    // FOOD_HUNGER_RELIEF
    ['food-hunger-relief', TopicV2.FOOD_HUNGER_RELIEF],
    ['agriculture-food', TopicV2.FOOD_HUNGER_RELIEF],

    // GENDER_EQUALITY
    ['gender-equality', TopicV2.GENDER_EQUALITY],
    ['diversity-genderequality', TopicV2.GENDER_EQUALITY],

    // HOUSING
    ['housing', TopicV2.HOUSING],
    ['building-housing', TopicV2.HOUSING],

    // HUMAN_RIGHTS
    ['human-rights', TopicV2.HUMAN_RIGHTS],
    ['democracy-human-rights', TopicV2.HUMAN_RIGHTS],

    // LGBTQIA_PLUS
    ['lgbtqia-plus', TopicV2.LGBTQIA_PLUS],

    // LIFESTYLE_CONSUMPTION
    ['lifestyle-consumption', TopicV2.LIFESTYLE_CONSUMPTION],
    ['consumption-lifestyle', TopicV2.LIFESTYLE_CONSUMPTION],
    ['eco-tourism', TopicV2.LIFESTYLE_CONSUMPTION],

    // LITERACY_EDUCATION
    ['literacy-education', TopicV2.LITERACY_EDUCATION],
    ['education-science', TopicV2.LITERACY_EDUCATION],

    // MENTAL_PHYSICAL_HEALTH
    ['mental-physical-health', TopicV2.MENTAL_PHYSICAL_HEALTH],
    ['physical-mental-health', TopicV2.MENTAL_PHYSICAL_HEALTH],

    // MIGRATION_REFUGEES
    ['migration-refugees', TopicV2.MIGRATION_REFUGEES],
    ['migration-integration', TopicV2.MIGRATION_REFUGEES],

    // MOBILITY_TRANSPORT
    ['mobility-transport', TopicV2.MOBILITY_TRANSPORT],
    ['mobility-infrastructure', TopicV2.MOBILITY_TRANSPORT],

    // OTHER
    ['other', TopicV2.OTHER],
    ['alternative-economy', TopicV2.OTHER],
    ['urban-rural-development', TopicV2.OTHER],

    // PEACE_SECURITY
    ['peace-security', TopicV2.PEACE_SECURITY],

    // POVERTY_HOMELESSNESS
    ['poverty-homelessness', TopicV2.POVERTY_HOMELESSNESS],
    ['poverty-homelesness', TopicV2.POVERTY_HOMELESSNESS],

    // SPORTS_RECREATION
    ['sports-recreation', TopicV2.SPORTS_RECREATION],

    // TECHNOLOGY_INNOVATION
    ['technology-innovation', TopicV2.TECHNOLOGY_INNOVATION],
    ['technological-innovation', TopicV2.TECHNOLOGY_INNOVATION],

    // YOUTH_DEVELOPMENT
    ['youth-development', TopicV2.YOUTH_DEVELOPMENT],
    ['children-youth', TopicV2.YOUTH_DEVELOPMENT],

    // Edge cases
    ['', TopicV2.OTHER],
    ['unknown-slug', TopicV2.OTHER],
  ]);

  // Test all mappings
  test.each(Array.from(testCases.entries()))(
    '%s → %s',
    (input, expected) => {
      expect(slugToTopicV2(input)).toBe(expected);
    }
  );

  // Verify all enum values are covered
  test('should have test cases for all TopicV2 enum values', () => {
    const allTopicValues = Object.values(TopicV2);
    const testedTopicValues = new Set(testCases.values());

    allTopicValues.forEach(topic => {
      expect(testedTopicValues).toContain(topic);
    });
  });
});