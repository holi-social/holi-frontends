import type { LocalizedTypesenseDocument, TypesenseDocument } from '@holi/core/typesense/types'

const getTitle = (language: string, document: TypesenseDocument): string => {
  if (document.title_en && (language === 'en' || !document.title_de)) {
    return document.title_en
  }
  return document.title_de ?? ''
}

const getDescription = (language: string, document: TypesenseDocument): string => {
  if (document.description_en && (language === 'en' || !document.description_de)) {
    return document.description_en
  }
  return document.description_de ?? ''
}

const getSummary = (language: string, document: TypesenseDocument): string => {
  if (document.summary_en && (language === 'en' || !document.summary_de)) {
    return document.summary_en
  }
  return document.summary_de ?? ''
}

const getLocationCountry = (language: string, document: TypesenseDocument): string => {
  if (document.location_country_en && (language === 'en' || !document.location_country_de)) {
    return document.location_country_en
  }
  return document.location_country_de ?? ''
}

const getOrganizerLocationCountry = (language: string, document: TypesenseDocument): string => {
  if (document.organizer_location_country_en && (language === 'en' || !document.organizer_location_country_de)) {
    return document.organizer_location_country_en
  }
  return document.organizer_location_country_de ?? ''
}

export const localizeTypesenseDocument = (
  document: TypesenseDocument,
  language: string
): LocalizedTypesenseDocument => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title_de, title_en, description_de, description_en, ...rest } = document
  return {
    ...rest,
    title: getTitle(language, document),
    description: getDescription(language, document),
    summary: getSummary(language, document),
    locationCountry: getLocationCountry(language, document),
    organizerLocationCountry: getOrganizerLocationCountry(language, document),
  }
}
