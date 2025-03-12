import {
  type SkillV2,
  skillV2Slugs,
  slugsToSkillsV2,
  slugsToTopicsV2,
  slugToSkillV2,
  slugToTopicV2,
  type TopicV2,
  topicV2Slugs,
} from '@holi/core/domain/shared/types'

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
  test.each(Array.from(testCases.entries()))('topic slug "%s" maps to "%s"', (input, expected) => {
    expect(slugToTopicV2(input)).toBe(expected)
  })

  test('verify that for all slugs mapped in the implementation a test case exists', () => {
    const allSlugs = Object.values(topicV2Slugs).flat()
    const testedSlugs = new Set(testCases.keys())

    allSlugs.forEach((slug) => {
      expect(testedSlugs).toContain(slug)
    })
  })
})

describe('slugsToTopicsV2', () => {
  it('should map all slugs', () => {
    const slugs = ['education-science', 'biodiversity-animal-welfare', 'lgbtqia-plus']
    const expectedTopicsV2 = ['animal-welfare', 'lgbtqia-plus', 'literacy-education']

    const actualTopicsV2 = slugsToTopicsV2(slugs)
    actualTopicsV2.sort()

    expect(actualTopicsV2).toEqual(expectedTopicsV2)
  })

  it('should filter duplicate slugs', () => {
    const slugs = ['climate-protection', 'water-ocean']
    const expectedTopicsV2 = ['climate-environment']

    const actualTopicsV2 = slugsToTopicsV2(slugs)

    expect(actualTopicsV2).toEqual(expectedTopicsV2)
  })

  it('should filter unknown slugs', () => {
    const slugs = ['', 'human-rights', 'unknown']
    const expectedTopicsV2 = ['human-rights']

    const actualTopicsV2 = slugsToTopicsV2(slugs)

    expect(actualTopicsV2).toEqual(expectedTopicsV2)
  })
})

describe('slugToSkillV2', () => {
  const testCases = new Map<string, SkillV2 | undefined>([
    // Music Performance
    ['music-performance', 'music-performance'],

    // Childcare
    ['childcare', 'childcare'],

    // Sales & Distribution
    ['sales-distribution', 'sales-distribution'],

    // Emergency Care
    ['emergency-care', 'emergency-care'],

    // Animal Care
    ['animal-care', 'animal-care'],

    // Religious & Spiritual Care
    ['religious-spiritual-care', 'religious-spiritual-care'],

    // Gardening & Conservation
    ['gardening-conservation', 'gardening-conservation'],

    // Community Organizing
    ['community-organizing', 'community-organizing'],

    // Event Planning
    ['event-planning', 'event-planning'],

    // Arts & Crafts
    ['arts-crafts', 'arts-crafts'],
    ['arts-music-culture', 'arts-crafts'],

    // Intercultural Competence
    ['intercultural-competence', 'intercultural-competence'],
    ['inclusive-mindset-intercultural-competence', 'intercultural-competence'],

    // Driving
    ['driving', 'driving'],
    ['drive-transport', 'driving'],

    // Legal Assistance
    ['legal-assistance', 'legal-assistance'],
    ['law-regulations', 'legal-assistance'],

    // Nursing & Caregiving
    ['nursing-caregiving', 'nursing-caregiving'],
    ['caring-nursing', 'nursing-caregiving'],

    // Food Service
    ['food-service', 'food-service'],
    ['cooking-baking', 'food-service'],

    // Translation
    ['translation', 'translation'],
    ['writing-translation', 'translation'],

    // Administration
    ['administration', 'administration'],
    ['organizational-skills', 'administration'],

    // Creativity & Design
    ['creativity-design', 'creativity-design'],
    ['creativity', 'creativity-design'],
    ['design', 'creativity-design'],
    ['development-concept', 'creativity-design'],

    // Tutoring & Coaching
    ['tutoring-coaching', 'tutoring-coaching'],
    ['teaching-education', 'tutoring-coaching'],
    ['coaching & mentoring', 'tutoring-coaching'],

    // Marketing & Communications
    ['marketing-communications', 'marketing-communications'],
    ['marketing-social-media', 'marketing-communications'],
    ['communication-skills', 'marketing-communications'],
    ['public-relations', 'marketing-communications'],

    // Team Leadership
    ['team-leadership', 'team-leadership'],
    ['coordination-coordination-of-volunteers', 'team-leadership'],
    ['leadership', 'team-leadership'],
    ['teamwork', 'team-leadership'],

    // Research & Analysis
    ['research-analysis', 'research-analysis'],
    ['critical-thinking', 'research-analysis'],
    ['analytical-thinking', 'research-analysis'],
    ['knowledge-management', 'research-analysis'],

    // Other
    ['other', 'other'],
    ['environmental-awareness', 'other'],
    ['commitment', 'other'],
    ['conflict-management', 'other'],
    ['discipline', 'other'],
    ['empathy', 'other'],
    ['hands-on-support', 'other'],
    ['holistic-thinking', 'other'],
    ['humour', 'other'],
    ['independence', 'other'],
    ['initiative-and-energy', 'other'],
    ['mindfulness', 'other'],
    ['motivation', 'other'],
    ['negotiation-skills', 'other'],
    ['openness', 'other'],
    ['relationship-skills', 'other'],
    ['resilience', 'other'],
    ['self-confident', 'other'],
    ['solution-orientedness', 'other'],
    ['willingness-to-learn', 'other'],
    ['adaptability', 'other'],
    ['visionary-thinking', 'other'],
    ['assertiveness', 'other'],

    // Fundraising
    ['fundraising', 'fundraising'],

    // Moderation & Facilitation
    ['moderation-facilitation', 'moderation-facilitation'],

    // Management & Strategy
    ['management-strategy', 'management-strategy'],

    // IT & Technology
    ['it-technology', 'it-technology'],

    // Finances & Taxes
    ['finances-taxes', 'finances-taxes'],

    // Building & Handicraft
    ['building-handicraft', 'building-handicraft'],

    // Edge cases
    ['', undefined],
    ['unknown-slug', undefined],
  ])

  test.each(Array.from(testCases.entries()))('skill slug "%s" maps to "%s"', (input, expected) => {
    expect(slugToSkillV2(input)).toBe(expected)
  })

  test('verify that for all slugs mapped in the implementation a test case exists', () => {
    const allDefinedSlugs = Object.values(skillV2Slugs).flat()
    const testedSlugs = new Set(testCases.keys())

    allDefinedSlugs.forEach((slug) => {
      expect(testedSlugs).toContain(slug)
    })
  })
})

describe('slugsToSkillsV2', () => {
  it('should map all slugs', () => {
    const slugs = ['cooking-baking', 'law-regulations', 'animal-care']
    const expectedSkillsV2 = ['animal-care', 'food-service', 'legal-assistance']

    const actualSkillsV2 = slugsToSkillsV2(slugs)
    actualSkillsV2.sort()

    expect(actualSkillsV2).toEqual(expectedSkillsV2)
  })

  it('should filter duplicate slugs', () => {
    const slugs = ['empathy', 'humour']
    const expectedSkillsV2 = ['other']

    const actualSkillsV2 = slugsToSkillsV2(slugs)

    expect(actualSkillsV2).toEqual(expectedSkillsV2)
  })

  it('should filter unknown slugs', () => {
    const slugs = ['', 'legal-assistance', 'unknown']
    const expectedSkillsV2 = ['legal-assistance']

    const actualSkillsV2 = slugsToSkillsV2(slugs)

    expect(actualSkillsV2).toEqual(expectedSkillsV2)
  })
})
