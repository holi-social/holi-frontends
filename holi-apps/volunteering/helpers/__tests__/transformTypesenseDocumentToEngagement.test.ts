import { transformTypesenseDocumentToEngagement } from '@holi-apps/volunteering/helpers/transformTypesenseDocumentToEngagement'
import type { TypesenseDocument } from '@holi/core/typesense/types'

const document: TypesenseDocument = {
  id: 'volunteering_123',
  type: 'volunteering',
  title_de: 'Titel',
  title_en: 'Title',
  description_de: 'Beschreibung',
  description_en: 'Description',
  external_url: 'https://example.com',
  source: 'Aktion Mensch',
  organizer_name: 'Organizer',
  organizer_image_url: 'https://example.com/organizer.jpg',
  image_url: 'https://example.com/image.jpg',
  location: 'Hamburg, Germany',
  skills_v2: ['building-handicraft', 'emergency-care'],
  topics_v2: ['arts-culture', 'disaster-relief'],
}

describe('transformTypesenseDocumentToEngagement', () => {
  it('correctly transforms a Typesense document to a VolunteeringEngagement', () => {
    const result = transformTypesenseDocumentToEngagement(
      {
        highlight: {},
        document,
        text_match: 0,
      },
      'de'
    )

    expect(result).toEqual({
      id: 'volunteering_123',
      title: 'Titel',
      description: 'Beschreibung',
      url: 'https://example.com',
      source: 'Aktion Mensch',
      organizer: {
        name: 'Organizer',
        imageUrl: 'https://example.com/organizer.jpg',
      },
      imageUrl: 'https://example.com/image.jpg',
      location: 'Hamburg, Germany',
      skillsV2: ['building-handicraft', 'emergency-care'],
      topicsV2: ['arts-culture', 'disaster-relief'],
    })
  })

  it('uses title and description for the given language if available', () => {
    const result = transformTypesenseDocumentToEngagement(
      {
        highlight: {},
        document,
        text_match: 0,
      },
      'en'
    )

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
  })

  it('falls back to german title and description if english is missing', () => {
    const result = transformTypesenseDocumentToEngagement(
      {
        highlight: {},
        document: {
          ...document,
          title_en: undefined,
          description_en: undefined,
        },
        text_match: 0,
      },
      'en'
    )

    expect(result.title).toBe('Titel')
    expect(result.description).toBe('Beschreibung')
  })

  it('falls back to english title and description if german is missing', () => {
    const result = transformTypesenseDocumentToEngagement(
      {
        highlight: {},
        document: {
          ...document,
          title_de: undefined,
          description_de: undefined,
        },
        text_match: 0,
      },
      'de'
    )

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
  })

  it('prefers the id from the link locators if available', () => {
    const result = transformTypesenseDocumentToEngagement(
      {
        highlight: {},
        document: {
          ...document,
          link_locators: {
            volunteering: '123',
          },
        },
        text_match: 0,
      },
      'de'
    )

    expect(result.id).toBe('123')
  })
})
