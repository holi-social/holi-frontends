import {
  type Typesense_Document,
  Typesense_DocumentType,
  type Typesense_SearchParams_Input,
  type Typesense_SearchResponseHit,
} from '@holi/api/graphql/graphql-codegen'

export type SearchParams = Typesense_SearchParams_Input
export type SearchResponseHit = Typesense_SearchResponseHit
export type TypesenseDocument = Typesense_Document

export type TypesenseDocumentTypeEnum = Typesense_DocumentType
export const TypesenseDocumentType = Typesense_DocumentType

export type TypesenseDocumentLinkLocatorIdOrSlug = string | number

export type LocalizedTypesenseDocument = Omit<
  TypesenseDocument,
  'title_de' | 'title_en' | 'description_de' | 'description_en'
> & {
  title: string
  description: string
}
