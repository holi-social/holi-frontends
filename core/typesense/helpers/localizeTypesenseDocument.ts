import type { LocalizedTypesenseDocument, TypesenseDocument } from '@holi/core/typesense/types'

const LOCALIZED_FIELDS = ['title', 'description', 'summary', 'location_country', 'organizer_location_country'] as const
type LocalizedField = (typeof LOCALIZED_FIELDS)[number]
type Langauge = 'de' | 'en'

const getLocalizedFieldName = (language: Langauge, field: LocalizedField): keyof TypesenseDocument =>
  `${field}_${language}`

const getLocalizedValue = (language: Langauge, field: LocalizedField, document: TypesenseDocument): string => {
  const field_de = getLocalizedFieldName('de', field)
  const field_en = getLocalizedFieldName('en', field)

  if (document[field_en] && (language === 'en' || !document[field_de])) {
    return document[field_en].toString()
  }
  return document[field_de]?.toString() ?? ''
}

export const localizeTypesenseDocument = (
  document: TypesenseDocument,
  language: string
): LocalizedTypesenseDocument => {
  const normalizedLanguage = ['de', 'en'].includes(language) ? (language as Langauge) : 'en'
  const localized = { ...document } as LocalizedTypesenseDocument & TypesenseDocument
  for (const field of LOCALIZED_FIELDS) {
    delete localized[getLocalizedFieldName('de', field)]
    delete localized[getLocalizedFieldName('en', field)]
    localized[field] = getLocalizedValue(normalizedLanguage, field, document)
  }
  return localized
}
