import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
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

describe('localizeTypesenseDocument', () => {
  it('correctly localizes a Typesense document', () => {
    const result = localizeTypesenseDocument(document, 'de')

    expect(result).toEqual({
      id: 'volunteering_123',
      type: 'volunteering',
      title: 'Titel',
      description: 'Beschreibung',
      external_url: 'https://example.com',
      source: 'Aktion Mensch',
      organizer_name: 'Organizer',
      organizer_image_url: 'https://example.com/organizer.jpg',
      image_url: 'https://example.com/image.jpg',
      location: 'Hamburg, Germany',
      skills_v2: ['building-handicraft', 'emergency-care'],
      topics_v2: ['arts-culture', 'disaster-relief'],
    })
  })

  it('uses title and description for the given language if available', () => {
    const result = localizeTypesenseDocument(document, 'en')

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
  })

  it('falls back to german title and description if english is missing', () => {
    const result = localizeTypesenseDocument(
      {
        ...document,
        title_en: undefined,
        description_en: undefined,
      },
      'en'
    )

    expect(result.title).toBe('Titel')
    expect(result.description).toBe('Beschreibung')
  })

  it('falls back to english title and description if german is missing', () => {
    const result = localizeTypesenseDocument(
      {
        ...document,
        title_de: undefined,
        description_de: undefined,
      },
      'de'
    )

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
  })
})
