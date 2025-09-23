import { Typesense_DocumentType } from '@holi/api/graphql/graphql-codegen'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import {
  type LocalizedTypesenseDocument,
  TypesenseDocumentType,
  type TypesenseDocument,
} from '@holi/core/typesense/types'

const document: TypesenseDocument = {
  id: 'volunteering_123',
  type: TypesenseDocumentType.Volunteering,
  title_de: 'Titel',
  title_en: 'Title',
  description_de: 'Beschreibung',
  description_en: 'Description',
  external_url: 'https://example.com',
  source: 'Aktion Mensch',
  organizer_name: 'Organizer',
  organizer_image_url: 'https://example.com/organizer.jpg',
  organizer_url: 'https://example.com/organizer',
  image_url: 'https://example.com/image.jpg',
  location: 'Hamburg, Germany',
  skills_v2: ['building-handicraft', 'emergency-care'],
  topics_v2: ['arts-culture', 'disaster-relief'],
  summary_de: 'Zusammenfassung',
  summary_en: 'Summary',
  location_country_de: 'Deutschland',
  location_country_en: 'Germany',
  organizer_location_country_de: 'Schweiz',
  organizer_location_country_en: 'Switzerland',
}

describe('localizeTypesenseDocument', () => {
  it('correctly localizes a Typesense document', () => {
    const result = localizeTypesenseDocument(document, 'de')
    const expectedDocument: LocalizedTypesenseDocument = {
      id: 'volunteering_123',
      type: Typesense_DocumentType.Volunteering,
      title: 'Titel',
      description: 'Beschreibung',
      external_url: 'https://example.com',
      source: 'Aktion Mensch',
      organizer_name: 'Organizer',
      organizer_image_url: 'https://example.com/organizer.jpg',
      organizer_url: 'https://example.com/organizer',
      image_url: 'https://example.com/image.jpg',
      location: 'Hamburg, Germany',
      skills_v2: ['building-handicraft', 'emergency-care'],
      topics_v2: ['arts-culture', 'disaster-relief'],
      summary: 'Zusammenfassung',
      location_country: 'Deutschland',
      organizer_location_country: 'Schweiz',
    }

    expect(result).toEqual(expectedDocument)
  })

  it('uses texts for the given language if available', () => {
    const result = localizeTypesenseDocument(document, 'en')

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
    expect(result.summary).toBe('Summary')
    expect(result.location_country).toBe('Germany')
    expect(result.organizer_location_country).toBe('Switzerland')
  })

  it('falls back to german texts if english is missing', () => {
    const result = localizeTypesenseDocument(
      {
        ...document,
        title_en: undefined,
        description_en: undefined,
        summary_en: undefined,
        location_country_en: undefined,
        organizer_location_country_en: undefined,
      },
      'en'
    )

    expect(result.title).toBe('Titel')
    expect(result.description).toBe('Beschreibung')
    expect(result.summary).toBe('Zusammenfassung')
    expect(result.location_country).toBe('Deutschland')
    expect(result.organizer_location_country).toBe('Schweiz')
  })

  it('falls back to english texts if german is missing', () => {
    const result = localizeTypesenseDocument(
      {
        ...document,
        title_de: undefined,
        description_de: undefined,
        summary_de: undefined,
        location_country_de: undefined,
        organizer_location_country_de: undefined,
      },
      'de'
    )

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
    expect(result.summary).toBe('Summary')
    expect(result.location_country).toBe('Germany')
    expect(result.organizer_location_country).toBe('Switzerland')
  })

  it('falls back to english texts if given locale is invalid', () => {
    const result = localizeTypesenseDocument(document, 'es')

    expect(result.title).toBe('Title')
    expect(result.description).toBe('Description')
    expect(result.summary).toBe('Summary')
    expect(result.location_country).toBe('Germany')
    expect(result.organizer_location_country).toBe('Switzerland')
  })
})
