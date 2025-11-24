import type { LocalizedTypesenseDocument, TypesenseDocument } from '@holi/core/typesense/types'

const LOCALIZED_FIELDS = ['title', 'description', 'summary', 'location_country', 'organizer_location_country'] as const
type LocalizedField = (typeof LOCALIZED_FIELDS)[number]
type Language = 'de' | 'en'

const getLocalizedFieldName = (language: Language, field: LocalizedField): keyof TypesenseDocument =>
  `${field}_${language}`

const getLocalizedValue = (language: Language, field: LocalizedField, document: TypesenseDocument): string => {
  const field_de = getLocalizedFieldName('de', field)
  const field_en = getLocalizedFieldName('en', field)

  if (document[field_en] && (language === 'en' || !document[field_de])) {
    return document[field_en].toString()
  }

  if (document[field_de]) {
    return document[field_de].toString()
  }

  return getGenericFieldValue(field, document)
}

const getGenericFieldValue = (field: LocalizedField, document: TypesenseDocument): string => {
  switch (field) {
    case 'title':
      return document.title?.toString() ?? ''
    case 'description':
      return document.description?.toString() ?? ''
    default:
      return ''
  }
}

export const localizeTypesenseDocument = (
  document: TypesenseDocument,
  language: string
): LocalizedTypesenseDocument => {
  const normalizedLanguage = ['de', 'en'].includes(language) ? (language as Language) : 'en'
  const localized = { ...document } as LocalizedTypesenseDocument & TypesenseDocument
  for (const field of LOCALIZED_FIELDS) {
    delete localized[getLocalizedFieldName('de', field)]
    delete localized[getLocalizedFieldName('en', field)]
    localized[field] = getLocalizedValue(normalizedLanguage, field, document)
  }
  return localized
}
