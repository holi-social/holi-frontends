import { transformEngagementToTypesenseDocument } from '@holi-apps/volunteering/helpers/transformEngagementToTypesenseDocument'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

describe('transformEngagementToTypesenseDocument', () => {
  it('should transform a complete engagement object correctly', () => {
    const engagement: VolunteeringEngagement = {
      id: '123-abc',
      title: 'Beach Cleanup',
      description: 'Help clean the local beach',
      url: 'https://example.com/volunteer',
      source: 'community-hub',
      imageUrl: 'https://example.com/images/beach.jpg',
      organizer: {
        name: 'Community Volunteers',
        imageUrl: 'https://example.com/images/cv-logo.png',
      },
      location: 'Sunny Beach',
      latitude: 52.52,
      longitude: 13.405,
      topicsV2: ['environment', 'community'],
      skillsV2: ['teamwork', 'physical-labor'],
    }

    const result = transformEngagementToTypesenseDocument(engagement)

    expect(result).toEqual({
      type: 'volunteering',
      id: 'volunteering_123-abc',
      title_de: 'Beach Cleanup',
      title_en: 'Beach Cleanup',
      description_de: 'Help clean the local beach',
      description_en: 'Help clean the local beach',
      location: 'Sunny Beach',
      location_lat_lng: [52.52, 13.405],
      image_url: 'https://example.com/images/beach.jpg',
      link_locators: {
        volunteering: '123-abc',
      },
      topics_v2: ['environment', 'community'],
      skills_v2: ['teamwork', 'physical-labor'],
      source: 'community-hub',
      organizer_name: 'Community Volunteers',
      organizer_image_url: 'https://example.com/images/cv-logo.png',
      external_url: 'https://example.com/volunteer',
    })
  })

  it('should handle missing optional fields', () => {
    const minimalEngagement: VolunteeringEngagement = {
      id: '456-def',
      title: 'Food Bank Volunteer',
      description: 'Help sort donations at the food bank',
      url: 'https://example.com/food-bank',
      source: 'volunteer-match',
    }

    const result = transformEngagementToTypesenseDocument(minimalEngagement)

    expect(result).toEqual({
      type: 'volunteering',
      id: 'volunteering_456-def',
      title_de: 'Food Bank Volunteer',
      title_en: 'Food Bank Volunteer',
      description_de: 'Help sort donations at the food bank',
      description_en: 'Help sort donations at the food bank',
      link_locators: {
        volunteering: '456-def',
      },
      source: 'volunteer-match',
      external_url: 'https://example.com/food-bank',
    })
  })

  it('should handle partial location data correctly', () => {
    const partialLocationEngagement: VolunteeringEngagement = {
      id: '789-ghi',
      title: 'Tree Planting',
      description: 'Plant trees in the city park',
      url: 'https://example.com/tree-planting',
      source: 'green-city',
      location: 'City Park',
      // Only latitude provided, no longitude
      latitude: 48.8566,
    }

    const result = transformEngagementToTypesenseDocument(partialLocationEngagement)

    expect(result).toEqual({
      type: 'volunteering',
      id: 'volunteering_789-ghi',
      title_de: 'Tree Planting',
      title_en: 'Tree Planting',
      description_de: 'Plant trees in the city park',
      description_en: 'Plant trees in the city park',
      location: 'City Park',
      // location_lat_lng should be undefined since both lat and lng are required
      link_locators: {
        volunteering: '789-ghi',
      },
      source: 'green-city',
      external_url: 'https://example.com/tree-planting',
    })

    // Verify that location_lat_lng is not included when only partial coordinates are available
    expect(result.location_lat_lng).toBeUndefined()
  })

  it('should handle partial organizer data correctly', () => {
    const partialOrganizerEngagement: VolunteeringEngagement = {
      id: '101-jkl',
      title: 'Mentor Program',
      description: 'Mentor youth in the community',
      url: 'https://example.com/mentor',
      source: 'education-alliance',
      organizer: {
        // Only name provided, no imageUrl
        name: 'Education Alliance',
      },
    }

    const result = transformEngagementToTypesenseDocument(partialOrganizerEngagement)

    expect(result).toEqual({
      type: 'volunteering',
      id: 'volunteering_101-jkl',
      title_de: 'Mentor Program',
      title_en: 'Mentor Program',
      description_de: 'Mentor youth in the community',
      description_en: 'Mentor youth in the community',
      link_locators: {
        volunteering: '101-jkl',
      },
      source: 'education-alliance',
      organizer_name: 'Education Alliance',
      external_url: 'https://example.com/mentor',
    })

    // Verify that organizer_image_url is not included when not available
    expect(result.organizer_image_url).toBeUndefined()
  })

  it('should transform a recommendation correctly', () => {
    const engagement: VolunteeringReco = {
      engagement: {
        id: '123-abc',
        title: 'Beach Cleanup',
        description: 'Help clean the local beach',
        url: 'https://example.com/volunteer',
        source: 'community-hub',
        imageUrl: 'https://example.com/images/beach.jpg',
        organizer: {
          name: 'Community Volunteers',
          imageUrl: 'https://example.com/images/cv-logo.png',
        },
        location: 'Sunny Beach',
        latitude: 52.52,
        longitude: 13.405,
        topicsV2: ['environment', 'community'],
        skillsV2: ['teamwork', 'physical-labor'],
      },
      matchedTopicsV2: ['community', 'environment'],
      matchedSkillsV2: ['physical-labor', 'teamwork'],
    }

    const result = transformEngagementToTypesenseDocument(engagement)

    expect(result).toEqual({
      type: 'volunteering',
      id: 'volunteering_123-abc',
      title_de: 'Beach Cleanup',
      title_en: 'Beach Cleanup',
      description_de: 'Help clean the local beach',
      description_en: 'Help clean the local beach',
      location: 'Sunny Beach',
      location_lat_lng: [52.52, 13.405],
      image_url: 'https://example.com/images/beach.jpg',
      link_locators: {
        volunteering: '123-abc',
      },
      topics_v2: ['community', 'environment'],
      skills_v2: ['physical-labor', 'teamwork'],
      source: 'community-hub',
      organizer_name: 'Community Volunteers',
      organizer_image_url: 'https://example.com/images/cv-logo.png',
      external_url: 'https://example.com/volunteer',
    })
  })
})
