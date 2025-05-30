import { transformTypesenseDocument } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformTypesenseDocument'
import { TypesenseDocumentType, type TypesenseDocument } from '@holi/core/typesense/types'
import { MapPin2 } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}))

describe('transformDocument', () => {
  // Test data setup
  const baseDocument: TypesenseDocument = {
    type: TypesenseDocumentType.Volunteering,
    id: 'test-id-123',
    title_de: 'Deutscher Titel',
    title_en: 'English Title',
    description_de: 'Deutsche Beschreibung',
    description_en: 'English Description',
    source: 'Voltastics',
    location: 'Berlin, Germany',
    topics_v2: ['animal-welfare', 'gender-equality'],
    skills_v2: ['it-technology', 'management-strategy'],
    organizer_name: 'Test Organization',
    external_url: 'https://example.com/volunteering',
  }

  it('should transform a document with all fields correctly', () => {
    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', baseDocument)

    expect(result).toEqual({
      title: 'English Title',
      description: 'English Description',
      chips: [
        { title: 'topic.animal-welfare', color: 'green' },
        { title: 'topic.gender-equality', color: 'green' },
        { title: 'skill.it-technology', color: 'blue' },
        { title: 'skill.management-strategy', color: 'blue' },
      ],
      visibility: 'public',
      infoList: [
        {
          title: 'Berlin, Germany',
          icon: MapPin2,
        },
      ],
      coverImage: undefined,
      author: {
        topTitle: 'postedVia',
        title: 'Test Organization',
        mainAvatar: {
          source: expect.any(String), // This comes from the VOLUNTEERING_IMG_SOURCES_MAPPING
          label: 'Test Organization',
        },
      },
      externalUrl: 'https://example.com/volunteering',
    })
  })

  it('should handle German language preference correctly', () => {
    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'de', baseDocument)

    expect(result.title).toBe('Deutscher Titel')
    expect(result.description).toBe('Deutsche Beschreibung')
  })

  it('should fall back to English when German is not available', () => {
    const docWithoutGerman: TypesenseDocument = {
      ...baseDocument,
      title_de: undefined,
      description_de: undefined,
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'de', docWithoutGerman)

    expect(result.title).toBe('English Title')
    expect(result.description).toBe('English Description')
  })

  it('should handle missing optional fields gracefully', () => {
    const minimalDocument: TypesenseDocument = {
      type: TypesenseDocumentType.Volunteering,
      id: 'minimal-id',
      source: 'GoVolunteer',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', minimalDocument)

    expect(result).toEqual({
      title: '',
      description: '',
      chips: [],
      visibility: 'public',
      infoList: [],
      coverImage: undefined,
      author: {
        topTitle: 'postedVia',
        title: 'GoVolunteer',
        mainAvatar: {
          source: expect.any(String),
          label: '??',
        },
      },
      externalUrl: undefined,
    })
  })

  it('should handle image URLs correctly', () => {
    const documentWithImages: TypesenseDocument = {
      ...baseDocument,
      image_url: 'https://example.com/image.jpg',
      organizer_image_url: 'https://example.com/org-logo.jpg',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', documentWithImages)

    expect(result.coverImage).toEqual({
      uri: 'https://example.com/image.jpg',
    })
    expect(result.author?.mainAvatar?.source).toBe('https://example.com/org-logo.jpg')
  })

  it('should prioritize organizer_image_url over partner logo', () => {
    const docWithOrgImage: TypesenseDocument = {
      ...baseDocument,
      organizer_image_url: 'https://example.com/org-custom-logo.jpg',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', docWithOrgImage)
    expect(result.author?.mainAvatar.source).toBe('https://example.com/org-custom-logo.jpg')
  })

  it('should handle unknown source gracefully', () => {
    const docWithUnknownSource: TypesenseDocument = {
      ...baseDocument,
      source: 'UnknownSource',
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', docWithUnknownSource)
    expect(result.author?.title).toBe('Test Organization')
    // Should not crash when partner is undefined
    expect(result.author?.mainAvatar?.source).toBeUndefined()
  })

  it('should handle missing organizer name gracefully', () => {
    const docWithoutOrgName: TypesenseDocument = {
      ...baseDocument,
      organizer_name: undefined,
    }

    const { t } = useTranslation()
    const result = transformTypesenseDocument(t, 'en', docWithoutOrgName)
    expect(result.author?.title).toBe('Voltastics')
    expect(result.author?.mainAvatar?.label).toBe('??')
  })
})
