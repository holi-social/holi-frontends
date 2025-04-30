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
  }
}
